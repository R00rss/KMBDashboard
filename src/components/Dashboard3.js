import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
//import { ThemeProvider, createTheme } from "@mui/material/styles";
import { PieChart } from './Graphs/PieChart'
import { format } from 'date-fns';
import "./Dashboard3.css";
import SelectPrimary from './SelectPrimary';
import LoadingComponent from './LoadingComponent';
import { BarChart } from './Graphs/BarChart';
import colors from '../functions/Constans';
import { estilos_calendario } from '../functions/Constans';
const Dashboard3 = () => {
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [dataStatus, setDataStatus] = useState([])
    const [dataStatusMensual, setDataStatusMensual] = useState([])
    const [nameStatus, setNameStatus] = useState([])
    const [nameAgent, setNameAgent] = useState("No name")
    const [dateAgent, setDateAgent] = useState("****-**-**")
    const [agentes, setAgentes] = useState([])
    const [selectedAgente, setSelectedAgente] = useState([])
    const [date, setDate] = useState(new Date())
    const [statusList, setStatusList] = useState([])
    const getDataFromSelectAgentes = (data) => {
        setSelectedAgente(data)
    }
    const idToNames = (id, names) => {
        if (parseInt(id) === 0) {
            return "work"
        }

        let auxName = null
        names.forEach((name) => {
            if (parseInt(name[0]) === parseInt(id)) {
                auxName = name[1]
            }
        })
        return auxName
    }
    const customTooltip = ({ datum: { id, value, color, label } }) => (
        <div
            style={{
                padding: "1vh 2vw",
                color: "#ffffff",
                background: '#222222',
                display: "flex",
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div
                style={{
                    backgroundColor: color,
                    height: "2vh",
                    aspectRatio: 1 / 1,
                    marginRight: "1vw"
                }}
            >

            </div>
            <strong>
                {label} {id}
            </strong>
        </div>
    )

    const formatData = (data) => {
        let auxData = []
        for (const [key, value] of Object.entries(data)) {
            if (/^data$/.test(key)) {
                value.forEach((estado, i) => {
                    auxData.push({
                        "id": estado[1],//nombre del status
                        "value": (estado[2]), //valor del status en segundos
                        "label": idToNames(estado[0], nameStatus), // titulo de la legenda (valor en date time)
                        "color": "hsl(95, 70%, 50%)"
                    })
                })
            }
        }
        return auxData
    }
    const mergeArraysFromId2 = (data) => {
        const array = data['data']
        const statusList = []
        var size = 1;
        const result = []
        for (let index = 0; index < array.length; index += size) {
            const element = array[index];
            const auxName = element[1];
            const itemsThatMatch = array.filter((item) => (item[1] === auxName))
            const itemMixed = {}
            size = itemsThatMatch.length
            for (let i = 0; i < size; i++) {
                if (i === 0) {
                    itemMixed["id"] = itemsThatMatch[i][1]
                }
                const aux = String(idToNames(itemsThatMatch[i][2], nameStatus))
                //itemMixed[aux] = itemsThatMatch[i][3]
                itemMixed[aux] = itemsThatMatch[i][3]
                if (!(statusList.includes(aux))) {
                    statusList.push(aux)
                }
            }

            result.push(itemMixed)
        }
        console.log(data)
        console.log(result)
        console.log(statusList)
        setStatusList(statusList)
        return result
    }



    const getDataStatus = (agent = "", date = "") => {
        setLoading(true)
        //console.log("entro a get data status")
        const bodyData =
        {
            "agent": agent,
            "date": date
        }

        fetch("/api/estado", {
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
            setDataStatus(formatData(data))
            setNameAgent(data['agent'])
            setDateAgent(data['date'])
        }).then(
            setLoading(false)
        ).catch(error => { console.error("Error al enviar los datos:", error) })
    }
    const getDataStatusMensual = (month = "", agent = "") => {
        setLoading(true)
        //console.log("entro a get data status mensual")
        const bodyData =
        {
            "month": month,
            "agent": agent
        }

        fetch("/api/estado_mensual", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyData)
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
            setDataStatusMensual(mergeArraysFromId2(data))

            //console.log((separateAgents(data['data'],1)))
        }).then(
            setLoading(false)
        ).catch(error => { console.error("Error al enviar los datos:", error) })
    }
    const getNameStatus = () => {
        const bodyData = { "names": "" }
        fetch("/api/name_estado", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyData)
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
            setNameStatus(data)
        }).then(
        ).catch(error => { console.error("Error al enviar los datos:", error) })
    }
    const getAgentes = () => {
        fetch("/api/agentes_status", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
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
            setAgentes(data)
        }).then(
        ).catch(error => { console.error("Error al enviar los datos:", error) })
    }

    //optiene los datos para los selects
    useEffect(() => {
        getNameStatus()// eslint-disable-next-line
    }, [])

    useEffect(() => {
        getAgentes()// eslint-disable-next-line
    }, [])
    useEffect(() => {
        getDataStatus(selectedAgente, format(date, "yyyy-MM-dd"))// eslint-disable-next-line
    }, [selectedAgente, date])
    useEffect(() => {
        //console.log(format(date2, "MM"))
        getDataStatusMensual(format(date, "MM"), selectedAgente)//eslint-disable-next-line
    }, [date, selectedAgente])

    return (

        <div className='dashboard3__container'>
            <>
                <div className="part1__dashboard3">
                    <div className="individualAgent__container">
                        <div className="date__selector__container">
                            <SelectPrimary
                                title="Agentes"
                                data={agentes}
                                defaultOption="Escoja una Opción"
                                callbackFunction={getDataFromSelectAgentes}
                            />
                        </div>
                        <div className="calendar__container">
                            <div className="calendar__title__container">
                                <label htmlFor="customRange1" >Selecione una Fecha</label>
                            </div>
                            <div className='calendar__box'>

                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        className="datepicker__container"
                                        label=""
                                        value={date}
                                        onChange={(date) => {
                                            setDate(date)
                                        }}
                                        mask="__-__-____"
                                        inputFormat="dd-MM-yyyy"
                                        renderInput={(params) => (
                                            <TextField {...params} sx={estilos_calendario} />
                                        )}
                                    />
                                </LocalizationProvider>

                            </div>
                        </div>
                    </div>
                    {loading ? <LoadingComponent /> : dataStatus.length === 0 ? <></> :
                        <div className='anilisisIndividual__container'>
                            <h1 className="infoAgent">
                                <strong>Agente: </strong> {nameAgent} <strong>Fecha: </strong>{dateAgent}
                            </h1>
                            <div className="graphic__container">
                                <PieChart
                                    arcLinkLabelsTextColor={'#ffffff'}
                                    colors={colors}
                                    tooltip={customTooltip}
                                    data={dataStatus}
                                    arcLinkLabel="id"
                                    formattedValue={function (e) { return "" }} />
                            </div>
                        </div>
                    }
                </div>
                {dataStatusMensual.length > 0 ?
                    <div className="part2__dashboard3">
                        <div className='anilisisMensual__container'>
                            <h1 className="infoAgent">
                                <strong>Agente: </strong>{nameAgent} <strong>Mes: </strong>{dateAgent.slice(5, 7)}
                            </h1>
                            <div className="graphic__container2">
                                <BarChart
                                    data={dataStatusMensual}
                                    keys={statusList}
                                    legend={{ "left": "Número de horas", "bottom": "Día" }}
                                />
                            </div>
                        </div>
                    </div>
                    :
                    <></>
                }
            </>

        </div>
    )
}
export default Dashboard3