import React, { useEffect, useState } from 'react'
import "./HomeReportes.css"
import SelectPrimary from './SelectPrimary'
import TablaHome from './TablaHome'
const HomeReportes2 = (props) => {
    const dates = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Octubre", "Septiembre", "Noviembre", "Diciembre"]
    const [date, setDate] = useState("")
    const [client, setClient] = useState(null)
    const [cooperativas, setCooperativas] = useState([])
    const [selectedCooperativa, setSelectedCooperativa] = useState("")
    function date_to_number(month) {
        let num = -1
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
    const getDateFromSelect = (data) => {
        setDate(data)
    }
    const getCooperativaFromSelect = (data) => {
        setSelectedCooperativa(data)
    }
    useEffect(() => {
        props.callbackFunction(date, selectedCooperativa) // eslint-disable-next-line
    }, [date, selectedCooperativa])

    useEffect(() => {
        console.log(props.client) // eslint-disable-next-line
        setClient(props.client)
    }, [])

    useEffect(() => {
        if (props.client === null) {
            fetch("/api/cooperativas")
                .then(resp => {
                    if (resp.status === 200) return (resp.json())
                    else alert("Error", resp.status)
                }).then(data => {
                    setCooperativas(data)
                });
        }// eslint-disable-next-line
    }, [])
    useEffect(() => {
        setClient(selectedCooperativa)
    }, [selectedCooperativa])


    return (
        <div className='container__home'>

            <div className='container__cards'>
                <div className='tableHome__container col-7'>
                    <TablaHome date={date_to_number(date)} client={props.client === null ? selectedCooperativa : props.client} />
                </div>
                <div className='selectHome__container col-4'>
                    {props.client === null ?
                        <div className='home__select'>
                            <SelectPrimary
                                title="Seleccione una cooperativa"
                                data={cooperativas}
                                defaultOption="Escoja una cooperativa"
                                callbackFunction={getCooperativaFromSelect}
                                />
                        </div>
                        :
                        <></>
                    }

                    <div className='home__select'>
                        <SelectPrimary
                            title="Seleccione un mes"
                            data={dates}
                            defaultOption="Escoja una Opción"
                            callbackFunction={getDateFromSelect}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeReportes2