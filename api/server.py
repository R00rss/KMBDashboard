from flask import Flask, jsonify, render_template, request, Response
import json
import soundfile
from os import path
from functions.cryptography import encryption, encryption2, decryption, decryption2
from functions.generateKeys import read_private, read_public
from functions.dataBase import consulta, consultaOneRow, consulta2
from functions.Analisis import regresion_lineal, predecir
from functions.sentiment_analysis import get_polarity_from_string
from functions.Multipropositos import (
    obtener_arreglo_dias,
    lastDay,
    formatear_arreglo,
    stringToDateType,
)
from functions.dataToSend import (
    audioToText,
    dataForDashboard,
    generar_detalles_reporte,
    getDatosLlamada,
    generar_reportes,
    eficienciaAgente,
    dataForDashboard2,
    generar_datos_estado_individual,
    nombres_estados,
    generar_datos_estado_mensual,
    generar_estados_VOC,
    generar_estado_VOC,
    generar_dashboard5,
    generar_dashboard5_2,
    generar_dashboard_reportes_motivo,
    generar_dashboard_reportes_submotivo,
    generar_estados_rrss,
    generar_estado_rrss
)

# functions to encrypt
from functions.cryptography import encryption, decryption
from functions.generateKeys import read_private, read_public
from functions.traslate import traslate, traslate2

# variables para dashboard
selectedCooperativaDashboard = {}
selectedAgentDashboard = {}
selectedMonthDashboard = {}


############aplicacion flask#############

app = Flask(
    __name__, static_folder="../build/static", template_folder="../build"
)  # cuando se necesite cargar desde flask las templates de REACT


@app.route("/")
def index():
    return render_template("index.html")


# PARA QUE TODAS LAS RUTAS SE REDIRIJAN A index.html
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    return render_template("index.html")


##############RUTAS PARA GENERAR LA REGRESION Y PREDECIR#############
@app.route("/api/regresion", methods=["POST"])
def data_llamadas():
    if request.method == "POST":
        request_data = json.loads(request.data)
        cooperativa = request_data.get("cooperativa", False)
        cooperativas = consultaOneRow(
            "Select distinct (Cooperativa) FROM campaniasinbound.trx"
        )
        if cooperativa == False:
            return jsonify("No se encontro una cooperativa")
        if len(cooperativa) == 0:
            return jsonify("la cooperativa no puede estar vacia")
        if (
            cooperativa in cooperativas
        ):  # verifica que la cooperativa existe para no ejecutar el analisis en vano
            result = getDatosLlamada(cooperativa)
            result["coeficientes"] = regresion_lineal(result)
            return jsonify(result=result)
        return jsonify("La cooperativa ingresada no existe en la BD")


@app.route("/api/predecir", methods=["POST"])
def data_predecir():
    if request.method == "POST":
        request_data = json.loads(request.data)
        dateBase = request_data.get("dateBase", False)
        dateI = request_data.get("dateI", False)
        dateE = request_data.get("dateE", False)
        coeficientes = request_data.get("coeficientes", False)
        if (
            dateBase == False
            and dateI == False
            and dateE == False
            and coeficientes == False
        ):
            return jsonify("Uno de los datos no se han encontrado")

        result = predecir(dateI, dateE, dateBase, coeficientes)
        if result == None:
            return jsonify("Coeficientes no encontrados")
        result["dates_array"] = obtener_arreglo_dias(
            stringToDateType(dateI), stringToDateType(dateE)
        )
        return jsonify(result)


##########################RUTAS PARA CARGAR LOS DATOS EN VARIABLES GLOBALES ############
# SE DEBE CAMBIAR EL METODO PARA NO USAR VARIABLES GLOBALES
@app.route("/api/selectedAgent", methods=["POST"])
def selectedAgent():
    global selectedAgentDashboard
    if request.method == "POST":
        selectedAgent = json.loads(request.data)
        selectedAgentDashboard = selectedAgent["data"]
        return jsonify(Agent=selectedAgent)


@app.route("/api/selectedMonthDashboard", methods=["POST"])
def selectedMonthDashboard():
    global selectedMonthDashboard
    if request.method == "POST":
        request_data_date = json.loads(request.data)
        selectedMonthDashboard = request_data_date["mes"]
        return jsonify(MonthDashboard=selectedMonthDashboard)


@app.route("/api/selectedCooperativaDashboard", methods=["POST"])
def selectedCooperativaDashboard():
    global selectedCooperativaDashboard
    if request.method == "POST":
        request_data = json.loads(request.data)
        selectedCooperativaDashboard = request_data["data"]
        return jsonify(CooperativaDashboard=selectedCooperativaDashboard)


@app.route("/api/selectedMonth", methods=["POST", "GET"])
def selectedMonth():
    global selectedMonth_global
    if request.method == "POST":
        request_data_date = json.loads(request.data)
        selectedMonth_global = request_data_date["mes"]
    return {
        "mes": str(selectedMonth_global),
        "ult_dia": str(lastDay(selectedMonth_global)),
    }


########################RUTAS DE EJEMPLO#######################
@app.route("/api/encrypt_decrypt", methods=["POST"])
def example_encrypt_decrypt():
    if request.method == "POST":
        request_data = json.loads(request.data)
        user = request_data.get("user", False)
        password = request_data.get("password", False)
        if user == False or password == False:
            return jsonify("falta un campo")
        cypher_text = encryption(user.encode("utf-8"), read_public())
        print("cifrado:", cypher_text.decode("utf-8"))
        return jsonify(
            encryption=cypher_text.decode("utf-8"),
            descrytion=(decryption(cypher_text, read_private())).decode("utf-8"),
        )


##########################creation user#######################################


@app.route("/api/createUser", methods=["POST"])
def createUser():
    if request.method == "POST":
        request_data = json.loads(request.data)
        user = request_data.get("user", False)
        status = request_data.get("status", False)
        password = request_data.get("password", False)
        client = request_data.get("clientUser", False)

        # si no existe un campo no se hace ningun calculo y se returna la respuesta
        if user == False or password == False or status == False:
            return Response(
                response=json.dumps(
                    {"respuesta": "uno de los campos no fue ingresado correctamente"}
                ),
                status=400,
                mimetype="application/json",
            )
        # path del archivo json
        pathname = path.join(path.dirname(path.realpath(__file__)), "users.json")
        # parth de las keys
        pathPublicKeyName = path.join(
            path.dirname(path.realpath(__file__)), "public_shared.pem"
        )
        pathPrivateKeyName = path.join(
            path.dirname(path.realpath(__file__)), "private_noshare.pem"
        )

        # se lee el archivo y se guarda en usersFile
        file = open(pathname)
        usersFile = json.load(file)

        exist = False
        # verficacion de que el usuario existe
        for key in usersFile:
            if (
                decryption2(usersFile[key]["user"], read_private(pathPrivateKeyName))
                == user
            ):
                exist = True

        if exist:  # con base de datos se deberia verificar si el usuario existe
            return Response(
                response=json.dumps({"respuesta": "el usuario ya existe"}),
                status=409,
                mimetype="application/json",
            )

        # si no existe el usuario se crea:
        if len(usersFile) == 0:
            lastIndex = 1
        else:
            lastIndex = int(list(usersFile)[-1]) + 1
        if client != False:
            usersFile[lastIndex] = {
                "user": encryption2(str(user), read_public(pathPublicKeyName)),
                "password": encryption2(str(password), read_public(pathPublicKeyName)),
                "status": encryption2(str(status), read_public(pathPublicKeyName)),
                "clientUser": encryption2(str(client), read_public(pathPublicKeyName)),
            }
        else:
            usersFile[lastIndex] = {
                "user": encryption2(str(user), read_public(pathPublicKeyName)),
                "password": encryption2(str(password), read_public(pathPublicKeyName)),
                "status": encryption2(str(status), read_public(pathPublicKeyName)),
                "clientUser": encryption2("", read_public(pathPublicKeyName)),
            }
        # se guarda el diccionario dentro del archivo json
        with open(pathname, "w") as json_file:
            json.dump(usersFile, json_file, indent=2, separators=(",", ": "))
        # se envia la respuesta

        return Response(
            response=json.dumps({"respuesta": "el usuario fue creado con exito"}),
            status=200,
            mimetype="application/json",
        )


@app.route("/api/updateUser", methods=["POST"])
def updateUser():
    if request.method == "POST":
        request_data = json.loads(request.data)
        user = request_data.get("user", False)
        status = request_data.get("status", False)
        password = request_data.get("password", False)
        client = request_data.get("clientUser", False)

        # si no existe un campo no se hace ningun calculo y se returna la respuesta
        if user == False or password == False or status == False:
            return Response(
                response=json.dumps(
                    {"respuesta": "uno de los campos no fue ingresado correctamente"}
                ),
                status=400,
                mimetype="application/json",
            )
        # path del archivo json
        pathname = path.join(path.dirname(path.realpath(__file__)), "users.json")
        # parth de las keys
        pathPublicKeyName = path.join(
            path.dirname(path.realpath(__file__)), "public_shared.pem"
        )
        pathPrivateKeyName = path.join(
            path.dirname(path.realpath(__file__)), "private_noshare.pem"
        )

        # se lee el archivo y se guarda en usersFile
        file = open(pathname)
        usersFile = json.load(file)

        # verficacion de que el usuario existe
        for key in usersFile:
            if (
                decryption2(usersFile[key]["user"], read_private(pathPrivateKeyName))
                == user
            ):
                if client != False:
                    usersFile[key] = {
                        "user": encryption2(str(user), read_public(pathPublicKeyName)),
                        "password": encryption2(
                            str(password), read_public(pathPublicKeyName)
                        ),
                        "status": encryption2(
                            str(status), read_public(pathPublicKeyName)
                        ),
                        "clientUser": encryption2(
                            str(client), read_public(pathPublicKeyName)
                        ),
                    }
                else:
                    usersFile[key] = {
                        "user": encryption2(str(user), read_public(pathPublicKeyName)),
                        "password": encryption2(
                            str(password), read_public(pathPublicKeyName)
                        ),
                        "status": encryption2(
                            str(status), read_public(pathPublicKeyName)
                        ),
                        "clientUser": encryption2("", read_public(pathPublicKeyName)),
                    }

                with open(pathname, "w") as json_file:
                    json.dump(usersFile, json_file, indent=2, separators=(",", ": "))

                return Response(
                    response=json.dumps(
                        {
                            "respuesta": "el usuario fue actualizado correctamente",
                            "usuario": {
                                "usuario": user,
                                "password": password,
                                "status": status,
                                "client": client,
                            },
                        }
                    ),
                    status=201,
                    mimetype="application/json",
                )
        return Response(
            response=json.dumps({"respuesta": "el usuario no se encuentra en la base"}),
            status=408,
            mimetype="application/json",
        )


@app.route("/api/deleteUser", methods=["POST"])
def deleteUser():
    if request.method == "POST":
        request_data = json.loads(request.data)
        user = request_data.get("user", False)

        # si no existe un campo no se hace ningun calculo y se returna la respuesta
        if user == False:
            return Response(
                response=json.dumps(
                    {"respuesta": "uno de los campos no fue ingresado correctamente"}
                ),
                status=400,
                mimetype="application/json",
            )
        # path del archivo json
        pathname = path.join(path.dirname(path.realpath(__file__)), "users.json")
        # parth de las keys
        pathPrivateKeyName = path.join(
            path.dirname(path.realpath(__file__)), "private_noshare.pem"
        )

        # se lee el archivo y se guarda en usersFile
        file = open(pathname)
        usersFile = json.load(file)

        # verficacion de que el usuario existe
        for key in usersFile:
            if (
                decryption2(usersFile[key]["user"], read_private(pathPrivateKeyName))
                == user
            ):
                del usersFile[key]
                with open(pathname, "w") as json_file:
                    json.dump(usersFile, json_file, indent=2, separators=(",", ": "))
                return Response(
                    response=json.dumps(
                        {
                            "respuesta": "el usuario fue eliminado correctamente",
                            "usuario": {"usuario": user},
                        }
                    ),
                    status=200,
                    mimetype="application/json",
                )
        return Response(
            response=json.dumps({"respuesta": "el usuario no se encuentra en la base"}),
            status=404,
            mimetype="application/json",
        )


#################METODO PARA LA VERIFICACION########################
@app.route("/api/verification", methods=["POST"])
def userData():
    global selectedUser
    if request.method == "POST":
        request_data = json.loads(request.data)
        selectedUser = request_data.get("user", False)
        selectedPassword = request_data.get("password", False)
        # Password = consulta("Select Id from cck where IdUser ='{user}'".format(user = selectedUser[0]))

        if selectedUser == False or selectedPassword == False:
            return Response(
                response=json.dumps(
                    {"respuesta": "el usuario no se encuentra en la base"}
                ),
                status=408,
                mimetype="application/json",
            )

        print("contraseña ingresada:", selectedPassword)
        print("usuario ingresado", selectedUser)

        if (selectedPassword == "kimobill2022.") & (
            selectedUser == "operations_manager@kimobill.com"
        ):
            # return jsonify(verificacion=True,status = "operator")
            return jsonify(verificacion=True, status=1)

        # path del archivo json
        pathname = path.join(path.dirname(path.realpath(__file__)), "users.json")
        # parth de las keys
        # pathPublicKeyName = path.join(path.dirname(path.realpath(__file__)), "public_shared.pem")
        pathPrivateKeyName = path.join(
            path.dirname(path.realpath(__file__)), "private_noshare.pem"
        )
        # se lee el archivo y se guarda en usersFile
        file = open(pathname)
        usersFile = json.load(file)
        # verficacion de que el usuario existe
        # print(usersFile)
        for key in usersFile:
            if (
                decryption2(usersFile[key]["user"], read_private(pathPrivateKeyName))
                == selectedUser
            ):
                if (
                    decryption2(
                        usersFile[key]["password"], read_private(pathPrivateKeyName)
                    )
                    == selectedPassword
                ):
                    if "clientUser" in usersFile[key]:
                        return Response(
                            response=json.dumps(
                                {
                                    "verificacion": True,
                                    "clientUser": decryption2(
                                        usersFile[key]["clientUser"],
                                        read_private(pathPrivateKeyName),
                                    ),
                                    "status": decryption2(
                                        usersFile[key]["status"],
                                        read_private(pathPrivateKeyName),
                                    ),
                                }
                            ),
                            status=200,
                            mimetype="application/json",
                        )
                    return Response(
                        response=json.dumps(
                            {
                                "verificacion": True,
                                "status": decryption2(
                                    usersFile[key]["status"],
                                    read_private(pathPrivateKeyName),
                                ),
                            },
                        ),
                        status=200,
                        mimetype="application/json",
                    )
        return Response(
            response=json.dumps({"verificacion": False}),
            status=408,
            mimetype="application/json",
        )


################################RUTAS PARA LOS DATOS DE LOS SELECTS##################
@app.route("/api/agentes")
def agents():
    agentes = consulta(
        "Select distinct (Agent) FROM campaniasinbound.trx where StartedManagement like '2022-%' group by Agent  order by count(ID) desc"
    )
    return jsonify(agentes)


@app.route("/api/agentes_status")
def agents_status():
    agentes = consulta2(
        "SELECT name FROM call_center.agent where estatus = 'A' order by name asc;"
    )
    return jsonify(formatear_arreglo(agentes))


@app.route("/api/años", methods=["POST", "GET"])
def getAños():
    c1 = "select distinct(substr(tmstmp,1,4)) from campaniasinbound.trx where tmstmp not like '0000%'"
    if request.method == "GET":
        años = consulta(c1)
        return jsonify(formatear_arreglo(años))
    if request.method == "POST":
        request_data = json.loads(request.data)
        selectedCooperativa = request_data.get("cooperativa", False)
        if selectedCooperativa == False:
            años = consulta(c1)
            return jsonify(formatear_arreglo(años))
        c1 = "select distinct(substr(tmstmp,1,4)) from campaniasinbound.trx where cooperativa = '{cooperativa}' and tmstmp not like '0000%'".format(
            cooperativa=selectedCooperativa
        )
        años = consulta(c1)
        return jsonify(formatear_arreglo(años))


@app.route("/api/meses", methods=["POST"])
def getMeses():
    if request.method == "POST":
        request_data = json.loads(request.data)
        selectedCooperativa = request_data.get("cooperativa", False)
        selectedAño = request_data.get("año", False)
        if selectedCooperativa == False or selectedAño == False:
            meses = [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Octubre",
                "Septiembre",
                "Noviembre",
                "Diciembre",
            ]
            return jsonify(formatear_arreglo(meses))
        c1 = "select distinct(substr(tmstmp,6,2)) from campaniasinbound.trx where cooperativa = '{cooperativa}' and tmstmp like '{año}-%' ORDER BY (substr(tmstmp,6,2))".format(
            año=selectedAño, cooperativa=selectedCooperativa
        )
        meses = consulta(c1)
        return jsonify(formatear_arreglo(meses))


@app.route("/api/cooperativas")
def cooperativas():
    cooperativas = consulta(
        "Select distinct (Cooperativa) FROM campaniasinbound.trx where Cooperativa !=''"
    )
    return jsonify(formatear_arreglo(cooperativas))
@app.route("/api/cooperativas_rrss")
def cooperativas_rrss():
    cooperativas = consulta(
        "Select distinct (Cliente) FROM campaniasinbound.encuesta where Cliente !=''"
    )
    return jsonify(formatear_arreglo(cooperativas))


@app.route("/api/cooperativas_callcenter")
def cooperativas_callcenter():
    return jsonify(
        formatear_arreglo(
            consulta2(
                "select name from call_center.campaign_entry WHERE name!= 'KIMOBILL' AND name!= 'KMB_MOTOS' AND name!= 'ZAMORA'"
            )
        )
    )


@app.route("/api/usuarios")
def usuarios():
    # cooperativas = consulta("Select distinct (Cooperativa) FROM campaniasinbound.trx where Cooperativa !=''" )
    pathname = path.join(path.dirname(path.realpath(__file__)), "users.json")
    file = open(pathname)
    usersFile = json.load(file)
    pathPrivateKeyName = path.join(
        path.dirname(path.realpath(__file__)), "private_noshare.pem"
    )
    # print(usersFile)
    usuarios = {}
    for key in usersFile:
        usuarios[key] = {
            "usuario": decryption2(
                usersFile[key]["user"], read_private(pathPrivateKeyName)
            ),
            "password": decryption2(
                usersFile[key]["password"], read_private(pathPrivateKeyName)
            ),
            "status": decryption2(
                usersFile[key]["status"], read_private(pathPrivateKeyName)
            ),
            "clientUser": decryption2(
                usersFile[key]["clientUser"], read_private(pathPrivateKeyName)
            ),
        }
    return jsonify(usuarios)


#################### PARA GENERAR LOS REPORTES #####################
@app.route("/api/detalles_reporte", methods=["POST"])
def detalles_reporte():
    if request.method == "POST":
        request_data = json.loads(request.data)
        cooperativa = request_data.get("cooperativa", False)
        mes = request_data.get("mes", False)
        if cooperativa == False or mes == False:
            return jsonify("falta un campo")
        if cooperativa == "":
            return jsonify(generar_detalles_reporte(mes))
        return jsonify(generar_detalles_reporte(mes, cooperativa))


@app.route("/api/reporte_diario", methods=["POST"])
def reporte_diario():
    if request.method == "POST":
        request_data = json.loads(request.data)
        cooperativa = request_data.get("cooperativa", False)
        mes = request_data.get("mes", False)
        if cooperativa == False or mes == False:
            return jsonify("falta un campo")
        if cooperativa == "":
            return jsonify(generar_reportes(mes))
        return jsonify(generar_reportes(mes, cooperativa))


@app.route("/api/audio_to_text", methods=["POST"])
def audio_to_text():
    if request.method == "POST":
        if "audio_file" in request.files:
            file = request.files["audio_file"]

            old_name = "old_audio.wav"
            new_name = "new_audio.wav"
            old_path_name = path.join(path.dirname(path.realpath(__file__)), old_name)
            new_path_name = path.join(path.dirname(path.realpath(__file__)), new_name)

            file.save(old_path_name)  # se guarda el archivo inicial
            data, samplerate = soundfile.read(
                old_path_name
            )  # se lee el archivo inicial
            soundfile.write(
                new_path_name, data, samplerate, subtype="PCM_16"
            )  # se setea el archivo con PCM_16

            # se inicia el analisis de sentimiento
            text = audioToText(new_path_name)
            return jsonify(
                message="se subio el audio!",
                text=text,
                polarity=get_polarity_from_string(text),
            )
        return jsonify(message="No se pudo subir el audio!")


######################DASHBOARD REPORTES#########################


@app.route("/api/motivo", methods=["POST"])
def motivo():
    if request.method == "POST":
        request_data = json.loads(request.data)
        cooperativa = request_data.get("cooperativa", False)
        dti = request_data.get("dateTimeI", False)
        dtf = request_data.get("dateTimeF", False)
        if dti == False or dtf == False or cooperativa == False:
            result = "something wrong with options"
        else:
            # result = json.dumps(dataForDashboard(options, data))
            result = json.dumps(
                generar_dashboard_reportes_motivo(
                    cooperativa=cooperativa, dateTimeI=dti, dateTimeF=dtf
                )
            )
        return Response(result, status=201, mimetype="application/json")


@app.route("/api/submotivo", methods=["POST"])
def subMotivo():
    if request.method == "POST":
        request_data = json.loads(request.data)
        cooperativa = request_data.get("cooperativa", False)
        dti = request_data.get("dateTimeI", False)
        dtf = request_data.get("dateTimeF", False)
        motivo = request_data.get("motivo", False)
        if dti == False or dtf == False or cooperativa == False or motivo == False:
            result = "something wrong with options"
        else:
            # result = json.dumps(dataForDashboard(options, data))
            result = json.dumps(
                generar_dashboard_reportes_submotivo(
                    cooperativa=cooperativa, dateTimeI=dti, dateTimeF=dtf, motivo=motivo
                )
            )
        return Response(result, status=201, mimetype="application/json")


##################PARA GENERAR LOS DASHBOARD####################
# USO DE VARIABLES GLOBALES
@app.route("/api/dataDashboard")
def dataDashboard():
    eficienciaAgenteGlobal = eficienciaAgente(
        selectedAgentDashboard, selectedCooperativaDashboard, selectedMonthDashboard
    )
    return jsonify(data=eficienciaAgenteGlobal)


@app.route("/api/traslate_test")
def traslate_test():
    aux = traslate2("ejemplo de traducion")
    return jsonify(data=aux)


@app.route("/api/Dashboard2", methods=["POST"])
def dashboard2():
    if request.method == "POST":
        request_data = json.loads(request.data)
        options = request_data.get("options", False)
        data = request_data.get("data", False)
        if options == False:
            if data == False:
                result = "data and options not found"
            else:
                result = "options not found"
        else:
            if data == False:
                result = "data not found"
            else:
                result = json.dumps(dataForDashboard(options, data))
        return Response(result, status=201, mimetype="application/json")


@app.route("/api/estado", methods=["POST"])
def estado():
    if request.method == "POST":
        request_data = json.loads(request.data)
        date = request_data.get("date", False)
        agent = request_data.get("agent", False)
        if date == False or agent == False:
            return Response(
                json.dumps({"error": "Falta uno o varios datos"}),
                status=418,
                mimetype="application/json",
            )
        result = json.dumps(generar_datos_estado_individual(agent, date))
        return Response(result, status=201, mimetype="application/json")


@app.route("/api/name_estado", methods=["POST"])
def name_estado():
    if request.method == "POST":
        resquest_data = json.loads(request.data)
        names = resquest_data.get("names", False)
        if names == False:
            return jsonify(response="no data")
        return jsonify(nombres_estados())


@app.route("/api/estado_mensual", methods=["POST"])
def estado_mensual():
    if request.method == "POST":
        resquest_data = json.loads(request.data)
        month = resquest_data.get("month", False)
        agent = resquest_data.get("agent", False)
        if month == False or agent == False:
            return jsonify(response="no data")
        return jsonify(generar_datos_estado_mensual(month, agent))


@app.route("/api/Dashboard2_2", methods=["POST"])
def dashboard2_2():
    if request.method == "POST":
        request_data = json.loads(request.data)
        options = request_data.get("options", False)
        data = request_data.get("data", False)
        if options == False:
            if data == False:
                result = "data and options not found"
            else:
                result = "options not found"
        else:
            if data == False:
                result = "data not found"
            else:
                result = json.dumps(dataForDashboard2(options, data))
        return Response(result, status=201, mimetype="application/json")



@app.route("/api/dashboardVOCrrss", methods=["POST"])
def dashboardVOCrrss():
    if request.method == "POST":
        request_data = json.loads(request.data)
        id_rrss = request_data.get("id_rrss", False)
        cooperativa = request_data.get("cooperativa", False)
        if id_rrss == False:
            if cooperativa == False:
                return Response(
                    "Opciones incorrectas", status=404, mimetype="application/json"
                )
            else:
                return Response(
                    json.dumps(generar_estados_rrss(cooperativa)),
                    status=200,
                    mimetype="application/json",
                )
        else:
            data = generar_estado_rrss(id_rrss)
            print(data)
            message = data["consulta_rrss"][2]
            polarity = get_polarity_from_string(message)
            return Response(
                json.dumps(
                    {"consulta_rrss": data["consulta_rrss"], "polarity": polarity}
                ),
                status=200,
                mimetype="application/json",
            )

    return Response("Error de metodo", status=404, mimetype="application/json")

@app.route("/api/dashboardVOC", methods=["POST"])
def dashboardVOC():
    if request.method == "POST":
        request_data = json.loads(request.data)
        id_llamada = request_data.get("id_llamada", False)
        cooperativa = request_data.get("cooperativa", False)
        if id_llamada == False:
            if cooperativa == False:
                return Response(
                    "Opciones incorrectas", status=404, mimetype="application/json"
                )
            else:
                return Response(
                    json.dumps(generar_estados_VOC(cooperativa)),
                    status=200,
                    mimetype="application/json",
                )
        else:
            data = generar_estado_VOC(id_llamada)
            print(data)
            message = data["consulta_llamada"][2]
            polarity = get_polarity_from_string(message)
            return Response(
                json.dumps(
                    {"consulta_llamada": data["consulta_llamada"], "polarity": polarity}
                ),
                status=200,
                mimetype="application/json",
            )

    return Response("Error de metodo", status=404, mimetype="application/json")


@app.route("/api/dashboardCallCenter", methods=["POST"])
def dashboardCallCenter():
    if request.method == "POST":
        request_data = json.loads(request.data)

        date = request_data.get("date", False)
        init = request_data.get("h_init", False)
        end = request_data.get("h_end", False)
        cooperativa = request_data.get("cooperativa", False)

        if date == False or init == False or end == False or cooperativa == False:
            return Response(
                "Opciones incorrectas", status=405, mimetype="application/json"
            )
        else:
            return Response(
                json.dumps(
                    generar_dashboard5(
                        date=date, init=init, end=end, cooperativa=cooperativa
                    )
                ),
                status=200,
                mimetype="application/json",
            )
    return Response("Error de metodo", status=404, mimetype="application/json")


@app.route("/api/dashboardCallCenter2", methods=["POST"])
def dashboardCallCenter2():
    if request.method == "POST":
        request_data = json.loads(request.data)

        date = request_data.get("date", False)
        dateE = request_data.get("dateE", False)
        init = request_data.get("h_init", False)
        end = request_data.get("h_end", False)
        cooperativa = request_data.get("cooperativa", False)

        if (
            date == False
            or init == False
            or end == False
            or cooperativa == False
            or dateE == False
        ):
            return Response(
                "Opciones incorrectas", status=405, mimetype="application/json"
            )
        else:
            return Response(
                json.dumps(
                    generar_dashboard5_2(
                        date=date,
                        dateE=dateE,
                        init=init,
                        end=end,
                        cooperativa=cooperativa,
                    )
                ),
                status=200,
                mimetype="application/json",
            )
    return Response("Error de metodo", status=404, mimetype="application/json")


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
