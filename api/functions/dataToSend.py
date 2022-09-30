from functions.dataBase import consulta, consulta2
from datetime import date
import speech_recognition as sr

from functions.Multipropositos import (
    lastDay,
    stringToDateType,
    numOfDays,
    añadiendo_dias,
    obtener_arreglo_dias,
)


def audioToText(file_name):  # path
    text = ""
    r = sr.Recognizer()
    with sr.AudioFile(file_name) as source:
        audio = r.record(source)  # read the entire audio fi
    try:
        # for testing purposes, we're just using the default API key
        # to use another API key, use `r.recognize_google(audio, key="GOOGLE_SPEECH_RECOGNITION_API_KEY")`
        # instead of `r.recognize_google(audio)`
        # print("Google Speech Recognition thinks you said: " + r.recognize_google(audio))
        # text = r.recognize_google(audio, language="es-AR")
        text = r.recognize_google(
            audio,
            language="es-EC",
        )
    except sr.UnknownValueError as e:
        text = "El audio no se pudo reconocer, error: {0}".format(e)
    except sr.RequestError as e:
        text = "error en el Request {0}".format(e)
    return text


def getDatosLlamada(cooperativa):
    dateI = consulta(
        "select substr(StartedManagement,1,10) as 'fecha de primera operacion' from trx where ID = (Select min(ID) FROM trx where Cooperativa = '{cooperativa}')".format(
            cooperativa=cooperativa
        )
    )
    dateE = consulta(
        "select substr(StartedManagement,1,10) as 'fecha de ultima operacion' from trx where ID = (Select max(ID) FROM trx where Cooperativa = '{cooperativa}')".format(
            cooperativa=cooperativa
        )
    )
    data = consulta(
        "Select count(ID),substr(StartedManagement,1,10) from campaniasinbound.trx where Cooperativa = '{cooperativa}' and StartedManagement BETWEEN  '{dateI}%' AND '{dateE}%' GROUP BY substr(StartedManagement,1,10)".format(
            dateI=dateI[0][0], dateE=dateE[0][0], cooperativa=cooperativa
        )
    )
    num_call = []
    date_call = []
    x_array = []
    i = 0
    for key, value in data:
        num_call.append(key)
        date_call.append(value)
        x_array.append(i)
        i = i + 1
    return {
        "cooperativa": cooperativa,
        "dateI": dateI[0][0],
        "dateE": dateE[0][0],
        "num_call": num_call,
        "date_call": date_call,
        "x_array": x_array,
    }


def eficienciaAgente(agente, cooperativa, mes):
    c1 = "SELECT EstadoLlamada, count(ID) FROM campaniasinbound.trx where Agent = '{agente}' group by EstadoLlamada ORDER BY COUNT(ID) desc".format(
        agente=agente
    )
    auxc1 = consulta(c1)
    todayYear = date.today().year
    todayYear = str(todayYear)
    ld = lastDay(mes)

    dFString = "{todayYear}-{M}-{LD}".format(M=mes, LD=ld, todayYear=todayYear)
    dIString = "{todayYear}-{M}-01".format(M=mes, todayYear=todayYear)
    dI = stringToDateType(dIString)
    dF = stringToDateType(dFString)

    # se calcula el numero de llamadas segun el estado y un mes seleccionado
    c1Mes = "SELECT EstadoLlamada, count(ID) FROM campaniasinbound.trx where Agent = '{agente}' and TMSTMP BETWEEN '{di} 00:00:00' AND '{df} 23:59:59' group by EstadoLlamada ORDER BY COUNT(ID) desc".format(
        agente=agente, di=dIString, df=dFString
    )
    c1MesCooperativa = "SELECT EstadoLlamada, count(ID) FROM campaniasinbound.trx where Agent = '{agente}' and Cooperativa ='{cooperativa}' and TMSTMP BETWEEN '{di} 00:00:00' AND '{df} 23:59:59' group by EstadoLlamada ORDER BY COUNT(ID) desc".format(
        agente=agente, di=dIString, df=dFString, cooperativa=cooperativa
    )
    cant_dias = numOfDays(dI, dF)

    # INFORMES DE EFICIENCIA DIARIOS

    auxfechainicial = dI.date()
    resultadoC1Diario = []
    resultadoC1CooperativaDiario = []
    resultadoDias = []
    for i in range(cant_dias + 1):
        c1Diario = consulta(
            "SELECT EstadoLlamada,count(ID) FROM campaniasinbound.trx where Cooperativa = '{cooperativa}' and StartedManagement like '{auxfechainicial}%'  group by EstadoLlamada ORDER BY COUNT(ID) desc".format(
                auxfechainicial=auxfechainicial, cooperativa=cooperativa
            )
        )
        # c1Diario = consulta(
        #    "SELECT EstadoLlamada,count(ID) FROM campaniasinbound.trx where Agent = '{agente}' and StartedManagement like '{auxfechainicial}%'  group by EstadoLlamada ORDER BY COUNT(ID) desc".format(
        #        agente=agente, auxfechainicial=auxfechainicial
        #    )
        # )
        c1CooperativaDiario = consulta(
            "SELECT EstadoLlamada,count(ID) FROM campaniasinbound.trx where Agent = '{agente}' and Cooperativa = '{cooperativa}' and StartedManagement like '{auxfechainicial}%'  group by EstadoLlamada ORDER BY COUNT(ID) desc".format(
                agente=agente, auxfechainicial=auxfechainicial, cooperativa=cooperativa
            )
        )
        resultadoC1Diario.append(c1Diario)
        resultadoC1CooperativaDiario.append(c1CooperativaDiario)
        auxfechainicial = añadiendo_dias(auxfechainicial, 1)
        resultadoDias.append(i + 1)

    auxc1Mes = consulta(c1Mes)
    auxc1MesCooperativa = consulta(c1MesCooperativa)
    # se calcula el numero de llamadas segun el estado y una cooperaiva seleccionada
    c1Cooperativa = "SELECT EstadoLlamada, count(ID) FROM campaniasinbound.trx where Agent = '{agente}' and Cooperativa = '{cooperativa}' group by EstadoLlamada ORDER BY COUNT(ID) desc".format(
        agente=agente, cooperativa=cooperativa
    )

    auxc1Cooperativa = consulta(c1Cooperativa)
    aux = []
    eficienciaAgenteGlobal = {}
    eficienciaAgenteGlobal["llamadas_global"] = auxc1
    eficienciaAgenteGlobal["llamadas_mes_" + mes] = auxc1Mes
    eficienciaAgenteGlobal[
        "llamadas_mes_" + mes + "_" + cooperativa
    ] = auxc1MesCooperativa
    eficienciaAgenteGlobal[
        "llamadas_global_cooperativa_" + cooperativa
    ] = auxc1Cooperativa
    eficienciaAgenteGlobal["llamadas_diario_mes_" + mes] = resultadoC1Diario
    eficienciaAgenteGlobal[
        "llamadas_diario_mes_" + mes + "_cooperativa_" + cooperativa
    ] = resultadoC1CooperativaDiario
    eficienciaAgenteGlobal["dias"] = resultadoDias
    eficienciaAgenteGlobal["cooperativa"] = cooperativa
    eficienciaAgenteGlobal["agente"] = agente
    eficienciaAgenteGlobal["mes"] = mes

    r = eficienciaAgenteGlobal
    return r


def generar_detalles_reporte(mes, cooperativa="COOPERATIVA DAQUILEMA"):
    lastD = lastDay(mes)
    todayYear = date.today().year
    todayYear = str(todayYear)
    dateI = "{todayYear}-{mes}-01".format(mes=mes, todayYear=todayYear)
    dateE = "{todayYear}-{mes}-{lastDay}".format(
        mes=mes, lastDay=lastD, todayYear=todayYear
    )
    return [
        consulta(
            "SELECT AGENT,substr(tmstmp,1,10) as Fecha, substr(StartedManagement,12,8) as HORA_INICIO, substr(TmStmp,12,8) AS HORA_FIN,  substr(timediff(TMSTMP,StartedManagement),1,8) AS TIEMPO, EstadoLlamada, Identificacion, NombreCliente, CiudadCliente, Convencional, Celular, Correo AS CORREO,EstadoCliente, MotivoLlamada, SubmotivoLlamada, Observaciones FROM campaniasinbound.trx WHERE Cooperativa = '{cooperativa}' AND TMSTMP BETWEEN '{dateI} 00:00:00' AND '{dateE} 23:59:59'".format(
                dateI=dateI, dateE=dateE, cooperativa=cooperativa
            )
        ),
        cooperativa,
    ]


def generar_estados_rrss(cooperativa="all"):
    if cooperativa == "all":
        return {
            "consulta_rrss": consulta(
                "select"
                + "    case   "
                + "        when cast(Respuesta1 as unsigned) between 1 and 4 then 'Detractor' "
                + "        when cast(Respuesta1 as unsigned) between 5 and 8 then 'Neutro'  "
                + "        when cast(Respuesta1 as unsigned) between 9 and 10 then 'Promotor'    "
                + "        else 'Sin nota'"
                + "    end as Estado,    "
                + "    cast(Respuesta1 as unsigned) as calificacion,"
                + "    Respuesta1_1 as VOC,"
                + "    substr(TmStmp,1,10) as fecha,"
                + "    Nombres as nombre,"
                + "    Id as id_llamada,"
                + "    Cliente as cooperativa,"
                + "  Identificacion as CI "
                + "from campaniasinbound.encuesta    "
                + "where length(Respuesta1_1)>0 group by VOC order by calificacion desc; "),
            "consulta_rrss_estados": consulta(
                "select"
                + "    case"
                + "        when cast(Respuesta1 as unsigned) between 1 and 4 then 'Detractores'"
                + "       when cast(Respuesta1 as unsigned) between 5 and 8 then 'Neutros'"
                + "       when cast(Respuesta1 as unsigned) between 9 and 10 then 'Promotores'"
                + "       else 'Sin nota'"
                + "    end as Estado,"
                + "   count(Id) as n "
                + "from campaniasinbound.encuesta "
                + "where length(Respuesta1)>0 group by Estado order by n desc;"
            ),
        }
    else:
        return {
            "consulta_rrss": consulta(
                "select"
                + "    case   "
                + "        when cast(Respuesta1 as unsigned) between 1 and 4 then 'Detractor' "
                + "        when cast(Respuesta1 as unsigned) between 5 and 8 then 'Neutro'  "
                + "        when cast(Respuesta1 as unsigned) between 9 and 10 then 'Promotor'    "
                + "        else 'Sin nota'"
                + "    end as Estado,    "
                + "    cast(Respuesta1 as unsigned) as calificacion,"
                + "    Respuesta1_1 as VOC,"
                + "    substr(TmStmp,1,10) as fecha,"
                + "    Nombres as nombre,"
                + "    Id as id_llamada,"
                + "    Cliente as cooperativa,"
                + "  Identificacion as CI "
                + "from campaniasinbound.encuesta    "
                + "where Cliente= '{cooperativa}' and length(Respuesta1)>0 group by VOC order by calificacion desc; ".format(
                    cooperativa=cooperativa
                )
            ),
            "consulta_rrss_estados": consulta(
                "select"
                + "    case"
                + "        when cast(Respuesta1 as unsigned) between 1 and 4 then 'Detractores'"
                + "       when cast(Respuesta1 as unsigned) between 5 and 8 then 'Neutros'"
                + "       when cast(Respuesta1 as unsigned) between 9 and 10 then 'Promotores'"
                + "       else 'Sin nota'"
                + "    end as Estado,"
                + "   count(Id) as n "
                + "from campaniasinbound.encuesta "
                + "where Cliente= '{cooperativa}' and length(Respuesta1)>0 group by Estado order by n desc;".format(
                    cooperativa=cooperativa
                )
            ),
            "cooperativa": cooperativa,
        }
def generar_estado_rrss(id_rrss):
    return {
        "consulta_rrss": consulta(
            "select"
            + "    case   "
            + "        when cast(Respuesta1 as unsigned) between 1 and 4 then 'Detrator' "
            + "        when cast(Respuesta1 as unsigned) between 5 and 8 then 'Neutro'  "
            + "        when cast(Respuesta1 as unsigned) between 9 and 10 then 'Promotor'    "
            + "        else 'Sin nota'"
            + "    end as Estado,    "
            + "    cast(Respuesta1 as unsigned) as calificacion,"
            + "    Respuesta1_1 as VOC,"
            + "    substr(TmStmp,1,10) as fecha,"
            + "    Nombres as nombre,"
            + "    Id as id_llamada,"
            + "    Cliente as cooperativa,"
            + "    Identificacion as CI "
            + "from campaniasinbound.encuesta   "
            + "where Id = {id_rrss}".format(id_rrss=id_rrss)
        )[0]
    }


def generar_estados_VOC(cooperativa="all"):
    if cooperativa == "all":
        return {
            "consulta_VOC": consulta(
                "select"
                + "    case   "
                + "        when cast(respuesta1 as unsigned) between 1 and 4 then 'Detractor' "
                + "        when cast(respuesta1 as unsigned) between 5 and 8 then 'Neutro'  "
                + "        when cast(respuesta1 as unsigned) between 9 and 10 then 'Promotor'    "
                + "        else 'Sin nota'"
                + "    end as Estado,    "
                + "    cast(respuesta1 as unsigned) as calificacion,"
                + "    respuesta2 as VOC,"
                + "    substr(StartedManagement,1,10) as fecha,"
                + "    NombreCliente as nombre,"
                + "    ID as id_llamada,"
                + "    Agent as Agente,"
                + "    substr(StartedManagement,12,8) as hora,"
                + "    Cooperativa as cooperativa,"
                + "  Identificacion as CI "
                + "from trx  "
                + "where length(respuesta2)>0 group by VOC order by calificacion desc; ",
            ),
            "consulta_estados": consulta(
                "select"
                + "    case"
                + "        when cast(respuesta1 as unsigned) between 1 and 4 then 'Detractores'"
                + "       when cast(respuesta1 as unsigned) between 5 and 8 then 'Neutros'"
                + "       when cast(respuesta1 as unsigned) between 9 and 10 then 'Promotores'"
                + "       else 'Sin nota'"
                + "    end as Estado,"
                + "   count(ID) as n "
                + "from trx "
                + "where length(respuesta1)>0 group by Estado order by n desc;"
            ),
        }
    else:
        return {
            "consulta_VOC": consulta(
                "select"
                + "    case   "
                + "        when cast(respuesta1 as unsigned) between 1 and 4 then 'Detractor' "
                + "        when cast(respuesta1 as unsigned) between 5 and 8 then 'Neutro'  "
                + "        when cast(respuesta1 as unsigned) between 9 and 10 then 'Promotor'    "
                + "        else 'Sin nota'"
                + "    end as Estado,    "
                + "    cast(respuesta1 as unsigned) as calificacion,"
                + "    respuesta2 as VOC,"
                + "    substr(StartedManagement,1,10) as fecha,"
                + "    NombreCliente as nombre,"
                + "    ID as id_llamada,"
                + "    Agent as Agente,"
                + "    substr(StartedManagement,12,8) as hora,"
                + "    Cooperativa as cooperativa,"
                + "    Identificacion as CI "
                + "from trx  "
                + "where Cooperativa= '{cooperativa}' and length(respuesta2)>0 group by VOC order by calificacion desc; ".format(
                    cooperativa=cooperativa
                )
            ),
            "consulta_estados": consulta(
                "select case"
                + "        when cast(respuesta1 as unsigned) between 1 and 4 then 'Detractores'"
                + "       when cast(respuesta1 as unsigned) between 5 and 8 then 'Neutros'"
                + "       when cast(respuesta1 as unsigned) between 9 and 10 then 'Promotores'"
                + "       else 'Sin nota'"
                + "    end as Estado,"
                + "   count(ID) as n "
                + "from trx "
                + "where Cooperativa= '{cooperativa}' and length(respuesta1)>0 group by Estado order by n desc;".format(
                    cooperativa=cooperativa
                )
            ),
            "cooperativa": cooperativa,
        }


def generar_estado_VOC(id_llamada):
    return {
        "consulta_llamada": consulta(
            "select"
            + "    case   "
            + "        when cast(respuesta1 as unsigned) between 1 and 4 then 'Detrator' "
            + "        when cast(respuesta1 as unsigned) between 5 and 8 then 'Neutro'  "
            + "        when cast(respuesta1 as unsigned) between 9 and 10 then 'Promotor'    "
            + "        else 'Sin nota'"
            + "    end as Estado,    "
            + "    cast(respuesta1 as unsigned) as calificacion,"
            + "    respuesta2 as VOC,"
            + "    substr(StartedManagement,1,10) as fecha,"
            + "    NombreCliente as nombre,"
            + "    ID as id_llamada,"
            + "    Agent as Agente, "
            + "    substr(StartedManagement,12,8) as hora,"
            + "    Cooperativa as cooperativa,"
            + "    Identificacion as CI "
            + "from trx  "
            + "where ID = {id_llamada}".format(id_llamada=id_llamada)
        )[0]
    }


# example COOPERATIVA OSCUS - 2022-01-01 00:00:00 - 2022-01-31 23:59:59
def generar_dashboard_reportes_motivo(cooperativa, dateTimeI, dateTimeF):  # all strings
    string_consulta = "SELECT DISTINCT(MotivoLlamada), COUNT(ID) FROM  trx   WHERE   Cooperativa = '{coo}' AND StartedManagement BETWEEN '{dti}' AND '{dtf}' AND MotivoLlamada != '' GROUP BY MotivoLlamada ORDER BY COUNT(ID) DESC".format(
        dti=dateTimeI, dtf=dateTimeF, coo=cooperativa
    )
    return consulta(string_consulta)


def generar_dashboard_reportes_submotivo(
    cooperativa, dateTimeI, dateTimeF, motivo
):  # all strings
    string_consulta = "SELECT DISTINCT(SubmotivoLlamada), COUNT(ID) FROM  trx   WHERE   Cooperativa = '{coo}' AND StartedManagement BETWEEN '{dti}' AND '{dtf}' AND MotivoLlamada = '{motivo}'  GROUP BY SubmotivoLlamada ORDER BY COUNT(ID) DESC".format(
        dti=dateTimeI, dtf=dateTimeF, coo=cooperativa, motivo=motivo
    )
    return consulta(string_consulta)


# {
# motivo1:{submotivo1:'porcentaje%',submotivo2:'porcentaje%',...},
# motivo2:{submotivo1:'porcentaje%',submotivo2:'porcentaje%',...},
# motivo3:{submotivo1:'porcentaje%',submotivo2:'porcentaje%',...},
# .
# .
# .
# }


def generar_dashboard5(date, init="00:00:00", end="23:59:59", cooperativa="all"):
    if cooperativa == "all":
        return {
            "consulta_dashbord5": consulta2(
                "SELECT campaign_entry.name,new_status,COUNT(call_progress_log.id) FROM call_center.call_progress_log,call_center.campaign_entry WHERE campaign_entry.id = call_progress_log.id_campaign_incoming AND datetime_entry BETWEEN '{date} {hour_range_init}' AND '{date} {hour_range_end}' GROUP BY campaign_entry.name,new_status".format(
                    date=date,
                    hour_range_init=init,
                    hour_range_end=end,
                )
            ),
            "date": date,
            "range_time": {"init": init, "end": end},
            "cooperativa": cooperativa,
        }
    else:
        return {
            "consulta_dashbord5": consulta2(
                "SELECT campaign_entry.name,new_status,COUNT(call_progress_log.id) FROM call_center.call_progress_log,call_center.campaign_entry WHERE campaign_entry.id = call_progress_log.id_campaign_incoming AND datetime_entry BETWEEN '{date} {hour_range_init}' AND '{date} {hour_range_end}' AND campaign_entry.name='{cooperativa}' GROUP BY campaign_entry.name,new_status".format(
                    date=date,
                    cooperativa=cooperativa,
                    hour_range_init=init,
                    hour_range_end=end,
                )
            ),
            "date": date,
            "range_time": {"init": init, "end": end},
            "cooperativa": cooperativa,
        }


def generar_dashboard5_2(
    date, dateE, init="00:00:00", end="23:59:59", cooperativa="all"
):
    if cooperativa == "all":
        return {
            "consulta_dashbord5": consulta2(
                "SELECT campaign_entry.name,new_status,COUNT(call_progress_log.id) FROM call_center.call_progress_log,call_center.campaign_entry WHERE campaign_entry.id = call_progress_log.id_campaign_incoming AND datetime_entry BETWEEN '{date}' AND '{dateE}' AND HOUR(datetime_entry) BETWEEN {hour_range_init} AND {hour_range_end}  GROUP BY campaign_entry.name,new_status".format(
                    date=date,
                    dateE=dateE,
                    hour_range_init=init,
                    hour_range_end=end,
                )
            ),
            "date": date,
            "dateE": dateE,
            "range_time": {"init": init, "end": end},
            "cooperativa": cooperativa,
        }
    else:
        return {
            "consulta_dashbord5": consulta2(
                "SELECT campaign_entry.name,new_status,COUNT(call_progress_log.id) FROM call_center.call_progress_log,call_center.campaign_entry WHERE campaign_entry.id = call_progress_log.id_campaign_incoming AND datetime_entry BETWEEN '{date} {hour_range_init}' AND '{date} {hour_range_end}' AND campaign_entry.name='{cooperativa}' GROUP BY campaign_entry.name,new_status".format(
                    date=date,
                    dateE=dateE,
                    cooperativa=cooperativa,
                    hour_range_init=init,
                    hour_range_end=end,
                )
            ),
            "date": date,
            "range_time": {"init": init, "end": end},
            "cooperativa": cooperativa,
        }


def generar_datos_estado_individual(agent, date):
    return {
        "data": consulta2(
            "SELECT IF( ISNULL(audit.id_break) = 1,'0',id_break) as Estado, DATE_FORMAT(SEC_TO_TIME(SUM(TIME_TO_SEC(audit.duration))),'%T') AS Duracion, CAST(SUM(TIME_TO_SEC(audit.duration))/3600 AS NCHAR) as DuracionValue FROM call_center.agent INNER JOIN call_center.audit ON audit.id_agent = agent.id WHERE datetime_init like '{date}%' and agent.name = '{agent}' group by id_break".format(
                agent=agent, date=date
            )
        ),
        "agent": agent,
        "date": date,
    }


def nombres_estados():
    return consulta2("SELECT id,LOWER(name) FROM call_center.break")


def generar_datos_estado_mensual(month, agent):
    return {
        "data": consulta2(
            "SELECT agent.name, DATE_FORMAT(datetime_init,'%d') as 'date',IF( ISNULL(audit.id_break) = 1,0,id_break) as Estado,SUM(TIME_TO_SEC(audit.duration)/3600) AS Duracion FROM call_center.audit  INNER JOIN call_center.agent on agent.id = audit.id_agent WHERE agent.name = '{agent}' AND datetime_init LIKE concat(year(curdate()),'-{month}%') group BY agent.name, substr(datetime_init,6,5) ASC, Estado ORDER BY agent.name, substr(datetime_init,6,5) ASC, id_agent ASC".format(
                month=month, agent=agent
            )
        ),
        "month": month,
    }


def generar_reportes(mes, cooperativa="COOPERATIVA DAQUILEMA"):  # "02"
    tEntrantes = 0
    tContestadas = 0
    tAbandonadas = 0
    pServicio = 0
    pAbandonado = 0
    todayYear = date.today().year
    todayYear = str(todayYear)
    llamadas_entrantes = []
    llamadas_atendidas = []
    llamadas_abandonadas = []
    nivel_servicio = []
    nivel_abandono = []
    ld = lastDay(mes)
    dI = stringToDateType("{todayYear}-{M}-01".format(M=mes, todayYear=todayYear))
    dF = stringToDateType(
        "{todayYear}-{M}-{LD}".format(M=mes, LD=ld, todayYear=todayYear)
    )
    dias = obtener_arreglo_dias(dI, dF)
    for dia in dias:
        auxLlamadaT = consulta(
            "SELECT count(ID) from  trx where Cooperativa = '{cooperativa}' AND StartedManagement like '{d} %'".format(
                d=dia, cooperativa=cooperativa
            )
        )
        llamadas_entrantes.append(auxLlamadaT)
        tEntrantes += int(auxLlamadaT[0][0])

        auxLlamada = consulta(
            "SELECT count(ID) from  trx where EstadoLlamada = 'Atendida' AND Cooperativa = '{cooperativa}' AND StartedManagement like '{d} %'".format(
                d=dia, cooperativa=cooperativa
            )
        )
        llamadas_atendidas.append(auxLlamada)
        tContestadas += int(auxLlamada[0][0])
        if auxLlamadaT[0][0] != 0:
            auxS = (auxLlamada[0][0] / auxLlamadaT[0][0]) * 100
        else:
            auxS = "100"
        nivel_servicio.append(auxS)
        pServicio += int(auxS)
        auxLlamada = consulta(
            "SELECT count(ID) from  trx where EstadoLlamada = 'Abandonada' AND Cooperativa = '{cooperativa}' AND StartedManagement like '{d} %'".format(
                d=dia, cooperativa=cooperativa
            )
        )
        llamadas_abandonadas.append(auxLlamada)
        tAbandonadas += int(auxLlamada[0][0])
        if auxLlamadaT[0][0] != 0:
            auxA = (auxLlamada[0][0] / auxLlamadaT[0][0]) * 100
        else:
            auxA = "0"
        nivel_abandono.append(auxA)
        pAbandonado += int(auxA)

    pAbandonado /= len(dias)
    pServicio /= len(dias)
    return {
        "dias": dias,
        "llamadas_entrantes": llamadas_entrantes,
        "llamadas_atendidas": llamadas_atendidas,
        "llamadas_abandonadas": llamadas_abandonadas,
        "nivel_abandono": nivel_abandono,
        "nivel_servicio": nivel_servicio,
        "TEntrantes": tEntrantes,
        "TContestadas": tContestadas,
        "TAbandonadas": tAbandonadas,
        "PServicio": pServicio,
        "PAbandono": pAbandonado,
    }


""" def generar_reporte(mes, cooperativa="COOPERATIVA CACPE GUALAQUIZA"):
    lastD = lastDay(mes)
    dateI = "2022-{mes}-01".format(mes=mes)
    dateE = "2022-{mes}-{lastDay}".format(mes=mes, lastDay=lastD)

    llamadasTotalesDiarias = consulta(
        "Select count(ID) as 'llamadas totales',substr(StartedManagement,1,10) as 'fecha de llamada' from campaniasinbound.trx where Cooperativa = '{cooperativa}' and StartedManagement BETWEEN  '{dateI} 00:00:00' AND '{dateE} 23:59:59' GROUP BY substr(StartedManagement,1,10)".format(
            cooperativa=cooperativa, dateI=dateI, dateE=dateE
        )
    )
    llamadasAtendidasDiarias = consulta(
        "Select count(ID) as 'llamadas atendidas',substr(StartedManagement,1,10) as 'fecha de llamada atendida' from campaniasinbound.trx where Cooperativa = '{cooperativa}' and EstadoLlamada = 'Atendida' and StartedManagement BETWEEN  '{dateI} 00:00:00' AND '{dateE} 23:59:59' GROUP BY substr(StartedManagement,1,10)".format(
            cooperativa=cooperativa, dateI=dateI, dateE=dateE
        )
    )
    llamadasAbandonadasDiarias = consulta(
        "Select count(ID) as 'llamadas Abandondas',substr(StartedManagement,1,10) as 'fecha de llamada abandonada' from campaniasinbound.trx where Cooperativa = '{cooperativa}' and EstadoLlamada = 'Abandonada' and StartedManagement BETWEEN  '{dateI} 00:00:00' AND '{dateE} 23:59:59' GROUP BY substr(StartedManagement,1,10)".format(
            cooperativa=cooperativa, dateI=dateI, dateE=dateE
        )
    )
    llamadasAbandonadasTotales = consulta(
        "Select count(ID) as 'total de llamadas Abandonadas'  from campaniasinbound.trx where Cooperativa = '{cooperativa}' and EstadoLlamada = 'Abandonada' and StartedManagement BETWEEN  '{dateI} 00:00:00' AND '{dateE} 23:59:59'".format(
            cooperativa=cooperativa, dateI=dateI, dateE=dateE
        )
    )
    llamadasAtendidasTotales = consulta(
        "Select count(ID) as 'total de llamadas atendidas'  from campaniasinbound.trx where Cooperativa = '{cooperativa}' and EstadoLlamada = 'Atendida' and StartedManagement BETWEEN  '{dateI} 00:00:00' AND '{dateE} 23:59:59'".format(
            cooperativa=cooperativa, dateI=dateI, dateE=dateE
        )
    )

    return {
        "llamadasTotalesDiarias": llamadasTotalesDiarias,
        "llamadasAtendidasDiarias": llamadasAtendidasDiarias,
        "llamadasAbandonadasDiarias": llamadasAbandonadasDiarias,
        "llamadasAbandonadasTotales": llamadasAbandonadasTotales[0][0],
        "llamadasAtendidasTotales": llamadasAtendidasTotales[0][0],
    } """


def dataForDashboard(options, data):
    if options["totalOrCooperativaSelection"] == "Cooperativa":
        # consultas por Cooperativa
        if options["period"] == "Anual":
            consulta1 = "Select Agent,EstadoLlamada,count(ID)from campaniasinbound.trx where  Cooperativa ='{cooperativa}' and Agent!='' and StartedManagement like '{año}%' group by Agent,EstadoLlamada order by Agent".format(
                año=data["año"], cooperativa=data["cooperativa"]
            )
        if options["period"] == "Mensual":
            consulta1 = "Select Agent,EstadoLlamada,count(ID)from campaniasinbound.trx where  Cooperativa ='{cooperativa}' and Agent!='' and StartedManagement like '{año}-{mes}-%' group by Agent,EstadoLlamada order by Agent".format(
                año=data["año"], mes=data["mes"], cooperativa=data["cooperativa"]
            )
        if options["period"] == "Total":
            consulta1 = "Select Agent,EstadoLlamada,count(ID)from campaniasinbound.trx where  Cooperativa ='{cooperativa}' and Agent!='' group by Agent,EstadoLlamada order by Agent".format(
                cooperativa=data["cooperativa"]
            )
    elif options["totalOrCooperativaSelection"] == "Total":
        # consultas TOTALES
        if options["period"] == "Anual":
            consulta1 = "Select Agent,EstadoLlamada,count(ID)from campaniasinbound.trx where Agent!='' and StartedManagement like '{año}%' group by Agent,EstadoLlamada order by Agent".format(
                año=data["año"],
            )
        if options["period"] == "Mensual":
            consulta1 = "Select Agent,EstadoLlamada,count(ID)from campaniasinbound.trx where Agent!='' and StartedManagement like '{año}-{mes}-%' group by Agent,EstadoLlamada order by Agent".format(
                año=data["año"],
                mes=data["mes"],
            )
        if options["period"] == "Total":
            consulta1 = "Select Agent,EstadoLlamada,count(ID)from campaniasinbound.trx where Agent!='' group by Agent,EstadoLlamada order by Agent"

    return consulta(consulta1)


def dataForDashboard2(options, data):
    consulta_text = ""
    if options["totalOrCooperativaSelection"] == "Cooperativa":
        # consultas por Cooperativa
        if options["period"] == "Anual":
            consulta_text = "Select Agent,EstadoLlamada,count(ID)from campaniasinbound.trx where  Cooperativa ='{cooperativa}' and Agent!='' and StartedManagement like '{año}%' group by Agent,EstadoLlamada order by Agent".format(
                año=data["año"], cooperativa=data["cooperativa"]
            )
        if options["period"] == "Mensual":
            consulta_text = "Select Agent,EstadoLlamada,count(ID)from campaniasinbound.trx where  Cooperativa ='{cooperativa}' and Agent!='' and StartedManagement like '{año}-{mes}-%' group by Agent,EstadoLlamada order by Agent".format(
                año=data["año"], mes=data["mes"], cooperativa=data["cooperativa"]
            )
        if options["period"] == "Total":
            consulta_text = "Select Agent,EstadoLlamada,count(ID)from campaniasinbound.trx where  Cooperativa ='{cooperativa}' and Agent!='' group by Agent,EstadoLlamada order by Agent".format(
                cooperativa=data["cooperativa"]
            )
        if options["period"] == "Diario":
            consulta_text = "Select Agent,EstadoLlamada,count(ID)from campaniasinbound.trx where  Cooperativa ='{cooperativa}' and Agent!='' and StartedManagement like '{año}-{mes}-{dia}%' group by Agent,EstadoLlamada order by Agent".format(
                año=data["año"],
                mes=data["mes"],
                dia=data["dia"],
                cooperativa=data["cooperativa"],
            )
    elif options["totalOrCooperativaSelection"] == "Total":
        # consultas TOTALES
        if options["period"] == "Anual":
            consulta_text = "Select Agent,EstadoLlamada,count(ID)from campaniasinbound.trx where Agent!='' and StartedManagement like '{año}%' group by Agent,EstadoLlamada order by Agent".format(
                año=data["año"],
            )
        if options["period"] == "Mensual":
            consulta_text = "Select Agent,EstadoLlamada,count(ID)from campaniasinbound.trx where Agent!='' and StartedManagement like '{año}-{mes}-%' group by Agent,EstadoLlamada order by Agent".format(
                año=data["año"],
                mes=data["mes"],
            )
        if options["period"] == "Total":
            consulta_text = "Select Agent,EstadoLlamada,count(ID)from campaniasinbound.trx where Agent!='' group by Agent,EstadoLlamada order by Agent"

        if options["period"] == "Diario":
            consulta_text = "Select Agent,EstadoLlamada,count(ID)from campaniasinbound.trx where Agent!='' and StartedManagement like '{año}-{mes}-{dia}%' group by Agent,EstadoLlamada order by Agent".format(
                año=data["año"], mes=data["mes"], dia=data["dia"]
            )
            print(consulta_text)

    return consulta(consulta_text)
