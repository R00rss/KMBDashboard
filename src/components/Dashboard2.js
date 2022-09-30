import React, { useState, useEffect } from 'react'
import "./DashboardGlobal.css"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import SelectPrimary from './SelectPrimary'
import { BarChart } from './Graphs/BarChart'
import LoadingComponent from './LoadingComponent'
import PathComponent from './PathComponent'
import SelectedCooperativa from './SelectedCooperativa'

const Dashboard2 = (props) => {
    const mesesdefault = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Octubre', 'Septiembre', 'Noviembre', 'Diciembre']

    function mount_to_number(month) {
        let num = "01"
        switch (month) {
            case "Enero":
                num = "01"
                break;
            case "Febrero":
                num = "02"
                break;
            case "Marzo":
                num = "03"
                break;
            case "Abril":
                num = "04"
                break;
            case "Mayo":
                num = "05"
                break;
            case "Junio":
                num = "06"
                break;
            case "Julio":
                num = "07"
                break;
            case "Agosto":
                num = "08"
                break;
            case "Octubre":
                num = "09"
                break;
            case "Septiembre":
                num = "10"
                break;
            case "Noviembre":
                num = "11"
                break;
            case "Diciembre":
                num = "12"
                break;
            default:
        }
        return num
    }
    function mount_to_number2(month) {
        let num = "1"
        switch (month) {
            case "Enero":
                num = "1"
                break;
            case "Febrero":
                num = "2"
                break;
            case "Marzo":
                num = "3"
                break;
            case "Abril":
                num = "4"
                break;
            case "Mayo":
                num = "5"
                break;
            case "Junio":
                num = "6"
                break;
            case "Julio":
                num = "7"
                break;
            case "Agosto":
                num = "8"
                break;
            case "Octubre":
                num = "9"
                break;
            case "Septiembre":
                num = "10"
                break;
            case "Noviembre":
                num = "11"
                break;
            case "Diciembre":
                num = "12"
                break;
            default:
        }
        return num
    }
    function number_to_mount(number) {
        let month = "Enero"
        switch (number) {
            case "01":
                month = "Enero"
                break;
            case "02":
                month = "Febrero"
                break;
            case "03":
                month = "Marzo"
                break;
            case "04":
                month = "Abril"
                break;
            case "05":
                month = "Mayo"
                break;
            case "06":
                month = "Junio"
                break;
            case "07":
                month = "Julio"
                break;
            case "08":
                month = "Agosto"
                break;
            case "09":
                month = "Octubre"
                break;
            case "10":
                month = "Septiembre"
                break;
            case "11":
                month = "Noviembre"
                break;
            case "12":
                month = "Diciembre"
                break;
            default:
        }
        return month
    }

    function getDaysInMonth(year, month) {
        const days = new Date(year, month, 0).getDate()
        console.log(days)
        return days;
    }
    function sliceIntoChunks(arr, chunkSize) {
        const res = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            const chunk = arr.slice(i, i + chunkSize);
            res.push(chunk);
        }
        console.log(res)
        return res;
    }
    const [dataToBarchart, setDataToBarchart] = useState([])
    const [loading, setLoading] = useState(false)
    const MySwal = withReactContent(Swal)
    //const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Octubre', 'Septiembre', 'Noviembre', 'Diciembre']
    const [dias, setDias] = useState([])
    const [meses, setMeses] = useState([])
    //OPCIONES GLOBALES
    const [optionCooperativaTotal, setOptionCooperativaTotal] = useState("")
    const [optionMesAñoTotal, setOptionMesAñoTotal] = useState("")
    //OPCIONES DE BUSQUEDA
    const [selectedCooperativa, setSelectedCooperativa] = useState("")
    const [selectedAño, setSelectedAño] = useState("")
    const [selectedMes, setSelectedMes] = useState("")
    const [selectedDia, setSelectedDia] = useState("")
    //Variables que se settean de la base de datos
    const [cooperativas, setCooperativas] = useState({})
    const [años, setAños] = useState({})

    //FUNCIONES PARA RECOGER DATOS DE LOS SELECTS

    //FUNCIONES PARA LAS OPCIONES GLOBALES
    const getDataFromSelectOption = (data) => {
        setOptionCooperativaTotal(data)
    }
    const getDataFromSelectOptionMesAñoTotal = (data) => {
        setOptionMesAñoTotal(data)
    }
    //FUNCIONES PARA LAS OPCIONES DE BUSQUEDA
    const getDataFromSelectCooperativa = (data) => {
        setSelectedCooperativa(data)
    }
    const getDataFromSelectAño = (data) => {
        setSelectedAño(data)
    }
    const getDataFromSelectMes = (data) => {
        setSelectedMes(data)
    }
    const getDataFromSelectDia = (data) => {
        setSelectedDia(data)
    }
    //Funcion para Resetear funciones
    /* const resetOptionsGlobales = () => {
        setOptionCooperativaTotal("")
        setOptionMesAñoTotal("")
    } */
    //FUNCION PARA FORMATEAR DATOS OBTENIDOS DEL BACKEND
    const mergeArraysFromId2 = (data) => {
        const array = data
        var size = 1;
        const result = []
        for (let index = 0; index < array.length; index += size) {
            const element = array[index];
            const auxName = element[0];
            const itemsThatMatch = array.filter((item) => (item[0] === auxName))
            const itemMixed = {}
            size = itemsThatMatch.length
            for (let i = 0; i < size; i++) {
                if (i === 0) {
                    itemMixed["id"] = itemsThatMatch[i][0]
                }
                const aux = String(itemsThatMatch[i][1])
                itemMixed[aux] = itemsThatMatch[i][1]
                itemMixed["Cantidad " + aux + "s"] = itemsThatMatch[i][2]
            }
            result.push(itemMixed)
        }
        return result
    }
    //////////////////////////////////////////
    const getDashboardFromBackend = (e) => {
        e.preventDefault()
        if (
            optionCooperativaTotal === 'Escoja una Opción'
            || optionMesAñoTotal === 'Escoja una Opción'
            || selectedAño === 'Escoja un año'
            || selectedCooperativa === 'Escoja una Cooperativa'
            || selectedMes === 'Escoja un Mes'
            || selectedDia === 'Escoja un día'
        ) {
            MySwal.fire({
                icon: 'warning',
                title: 'Alerta',
                text: '¡Todos los campos deben estar selecionados!'
            })
        } else {
            setLoading(true)
            console.log("el valor de loading es: ", loading)
            let auxDia = ""
            if (selectedDia.length === 1) {
                auxDia = "0" + selectedDia
            } else {
                auxDia = selectedDia
            }
            const bodyData =
            {
                "options": {
                    "totalOrCooperativaSelection": String(optionCooperativaTotal),
                    "period": String(optionMesAñoTotal)
                },
                "data": {
                    "año": String(selectedAño),
                    "mes": String(mount_to_number(selectedMes)),
                    "dia": String(auxDia),
                    "cooperativa": String(selectedCooperativa)
                }
            }
            fetch("/api/Dashboard2_2", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyData)
            }).then(resp => {
                if (resp.status === 201) return (resp.json())
                else {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: '¡Error en la respuesta del servidor!'
                    })
                }
            }
            ).then(data => {
                //formatDataToBarchart(data)
                console.log("555", data)
                setDataToBarchart(sliceIntoChunks(mergeArraysFromId2(data), 8))
                console.log("666: ", dataToBarchart)
                setLoading(false)
                console.log("el valor de loading es: ", loading)

            }).then(
            ).catch(error => { console.error("Error al enviar los datos:", error) })

        }

    }
    const getDataFromBackend = (url, setDataName) => {
        fetch("/api/" + url)
            .then(resp => {
                if (resp.status === 200) return (resp.json())
                else {
                    MySwal.fire({
                        icon: 'error',
                        title: '¡Error al trata de obtener: ' + url + "!",
                        text: '¡Error en el servidor,!' + String(resp.status)
                    })
                }
            }
            ).then(data_ => {
                setDataName(data_)
                console.log(data_)
            });
    }
    const consultarAños = (cooperativa) => {
        if (optionCooperativaTotal === "Total" || optionCooperativaTotal === "Escoja una Opción") {
            getDataFromBackend("años", setAños)
        } else {
            if (cooperativa === "Escoja una Cooperativa" && cooperativa === "") {
                fetch("/api/años", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                    })
                }).then(resp => {
                    if (resp.status === 200) return (resp.json())
                    else {
                        MySwal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: '¡Error en la respuesta del servidor!'
                        })
                    }
                }
                ).then(data => {
                    setAños(data)
                }).then(
                ).catch(error => { console.error("Error al enviar los datos:", error) })
            } else {
                fetch("/api/años", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        cooperativa: cooperativa,
                    })
                }).then(resp => {
                    if (resp.status === 200) return (resp.json())
                    else {
                        MySwal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: '¡Error en la respuesta del servidor!'
                        })
                    }
                }
                ).then(data => {
                    setAños(data)
                }).then(
                ).catch(error => { console.error("Error al enviar los datos:", error) })
            }
        }

    };
    const consultarMeses = (cooperativa, año) => {
        if (optionCooperativaTotal === "Total" || optionCooperativaTotal === "Escoja una Opción") {
            if (String(selectedAño) === String(new Date().getFullYear())) {
                setMeses(mesesdefault.slice(0, new Date().getMonth() + 1))
            } else if (selectedAño === "Escoja un año") {
                setMeses([])
            } else {
                setMeses(mesesdefault)
            }
        } else {
            if (cooperativa === "Escoja una Cooperativa" && cooperativa === "") {
                setMeses([])
            } else if (selectedAño !== "Escoja un año" & selectedAño !== "") {
                fetch("/api/meses", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        cooperativa: cooperativa,
                        año: año
                    })
                }).then(resp => {
                    if (resp.status === 200) return (resp.json())
                    else {
                        MySwal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: '¡Error en la respuesta del servidor!'
                        })
                    }
                }
                ).then(data => {
                    const aux = data.map((number) => {
                        console.log(number)
                        return (number_to_mount(String(number)))
                    })
                    setMeses(aux)
                }).then(
                ).catch(error => { console.error("Error al enviar los datos:", error) })
            }
        }

    };

    const generalOption = () => {
        return (
            <>
                {optionMesAñoTotal === "" || optionMesAñoTotal === "Escoja una Opción" ?
                    <SelectPrimary
                        title="Periodo"
                        data={['Anual', 'Mensual', 'Total', 'Diario']}
                        defaultOption="Escoja una Opción"
                        callbackFunction={getDataFromSelectOptionMesAñoTotal}
                    />
                    :
                    optionMesAñoTotal === 'Anual' ?
                        <>

                            <SelectPrimary
                                title="Año"
                                data={años}
                                defaultOption="Escoja un año"
                                callbackFunction={getDataFromSelectAño}

                            />

                        </>
                        :
                        optionMesAñoTotal === 'Mensual' ?
                            <>
                                <>
                                    <div className="col-12">
                                        <SelectPrimary
                                            title="Año"
                                            data={años}
                                            defaultOption="Escoja un año"
                                            callbackFunction={getDataFromSelectAño}

                                        />
                                    </div>
                                    <div className="col-12">
                                        <SelectPrimary
                                            title="Mes"
                                            data={meses}
                                            defaultOption="Escoja un Mes"
                                            callbackFunction={getDataFromSelectMes}

                                        />
                                    </div>
                                </>

                            </>
                            : optionMesAñoTotal === 'Diario' ?
                                <>
                                    <>
                                        <div className="col-12">
                                            <SelectPrimary
                                                title="Año"
                                                data={años}
                                                defaultOption="Escoja un año"
                                                callbackFunction={getDataFromSelectAño}

                                            />
                                        </div>
                                        <div className="col-12">
                                            <SelectPrimary
                                                title="Mes"
                                                data={meses}
                                                defaultOption="Escoja un Mes"
                                                callbackFunction={getDataFromSelectMes}

                                            />
                                        </div>
                                        <div className="col-12">
                                            <SelectPrimary
                                                title="Día"
                                                data={dias}
                                                defaultOption="Escoja un día"
                                                callbackFunction={getDataFromSelectDia}
                                            />
                                        </div>
                                    </>

                                </>

                                : ""

                }
            </>

        )
    }

    useEffect(() => {
        if (props.client === null) {
            getDataFromBackend("cooperativas", setCooperativas)// eslint-disable-next-line
        } else {
            setCooperativas([props.client])
        } // eslint-disable-next-line
    }, [])
    useEffect(() => {
        consultarAños(selectedCooperativa)// eslint-disable-next-line        
    }, [selectedCooperativa, optionCooperativaTotal])
    useEffect(() => {
        consultarMeses(selectedCooperativa, selectedAño)// eslint-disable-next-line        
    }, [selectedAño])
    useEffect(() => {
        if ((selectedAño !== "Escoja un año") & (selectedAño !== "") & (selectedMes !== "Escoja un Mes") & (selectedMes !== "")) {
            if (String(selectedAño) === String(new Date().getFullYear()) & mount_to_number2(selectedMes) === String(new Date().getMonth() + 1)) {
                setDias(Array.from({ length: parseInt(new Date().getDate()) }, (_, i) => i + 1))
            } else {
                setDias(Array.from({ length: parseInt(getDaysInMonth(selectedAño, mount_to_number(selectedMes))) }, (_, i) => i + 1))
            }
            console.log(dias)
        } else {
            setDias(Array.from({ length: 0 }, (_, i) => i + 1))
            console.log(dias)
        } // eslint-disable-next-line
    }, [selectedMes, selectedAño])

    return (
        <div className='dashboard__container col-12'>
            <div className="path__container">
                <button
                    className='btn__atras'
                    onClick={() => {
                        if (optionMesAñoTotal !== "" && optionMesAñoTotal !== "Escoja una Opción") {
                            setSelectedAño("")
                            setSelectedMes("")
                            setOptionMesAñoTotal("")
                            return;
                        }
                        if (selectedCooperativa !== "" && selectedCooperativa !== "Escoja una Cooperativa") {
                            setSelectedCooperativa("")
                            setOptionMesAñoTotal("")
                            return;
                        }
                        if (optionCooperativaTotal !== "" && optionCooperativaTotal !== "Escoja una Opción") {
                            setOptionCooperativaTotal("")
                            setSelectedCooperativa("")
                            setOptionMesAñoTotal("")
                            return;
                        }
                    }}
                >
                    Atras
                </button>
                <PathComponent
                    opcion1={optionCooperativaTotal}
                    opcion2={selectedCooperativa}
                    opcion3={optionMesAñoTotal}
                    opcion4={selectedAño}
                    opcion5={selectedMes}
                    opcion6={selectedDia}
                />
            </div>
            <div className="selects__container2">
                {optionCooperativaTotal === "Escoja una Opción" || optionCooperativaTotal === "" ?
                    <SelectPrimary
                        title="Cooperativa/Total"
                        data={props.client === null ? ['Cooperativa', 'Total'] : ['Cooperativa']}
                        defaultOption="Escoja una Opción"
                        callbackFunction={getDataFromSelectOption}
                    />
                    :
                    optionCooperativaTotal === 'Cooperativa' ?
                        <>
                            {selectedCooperativa === "" || selectedCooperativa === "Escoja una Cooperativa" ?
                                <SelectPrimary
                                    title="Cooperativa"
                                    data={cooperativas}
                                    defaultOption="Escoja una Cooperativa"
                                    callbackFunction={getDataFromSelectCooperativa}
                                />
                                :
                                <>
                                    {generalOption()}
                                </>


                            }
                        </>
                        : optionCooperativaTotal === 'Total' ?
                            <>
                                {generalOption()}
                            </>
                            : ""


                }
            </div>


            <div className="dashboarpage__calcular__btn__container">
                <button
                    className='dashboarpage__calcular__btn'
                    onClick={(e) => (getDashboardFromBackend(e))}>Calcular Eficiencia Total</button>
            </div>
            {loading === true ?
                <LoadingComponent /> :
                dataToBarchart.length === 1 ?
                    <>
                        <SelectedCooperativa logoname={selectedCooperativa} />
                        <div className="row1 col-12">
                            <div className="linechart__container col-10">
                                <div className="line__title__container">
                                    Llamadas/Agentes
                                </div>
                                <BarChart data={dataToBarchart[0]} />
                            </div>
                        </div>
                    </>
                    :
                    dataToBarchart.length > 1 ?
                        <>
                            <SelectedCooperativa logoname={selectedCooperativa} />
                            {dataToBarchart.map((data, key) => {
                                return (
                                    <div className="row1 col-12" key={`${key}01`}>
                                        <div className="linechart__container col-10" key={`${key}02`}>
                                            <div className="line__title__container">
                                                Llamadas/Agentes
                                            </div>
                                            <BarChart padding={data.length > 2 ? (data.length > 4 ? (data.length > 6 ? 0.3 : 0.4) : 0.6) : 0.8} data={data} />
                                        </div>
                                    </div>
                                )
                            })}
                        </>

                        : ""
            }
        </div>
    )
}

export default Dashboard2