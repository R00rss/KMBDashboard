import React, { useEffect, useState } from "react";
import "./SelectGlobal.css";
const SelectDateDashboard = () => {
    const [selectedDate, setSelectedDate] = useState("");
    const meses_default = ["febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "octubre", "septiembre", "noviembre", "diciembre"]
    const dates = (meses_default.slice(0, new Date().getMonth()))
    function date_to_number(month) {
        let num = "01"
        switch (month) {
            case "enero":
                num = "01"
                break;
            case "febrero":
                num = "02"
                break;
            case "marzo":
                num = "03"
                break;
            case "abril":
                num = "04"
                break;
            case "mayo":
                num = "05"
                break;
            case "junio":
                num = "06"
                break;
            case "julio":
                num = "07"
                break;
            case "agosto":
                num = "08"
                break;
            case "octubre":
                num = "09"
                break;
            case "septiembre":
                num = "10"
                break;
            case "noviembre":
                num = "11"
                break;
            case "diciembre":
                num = "12"
                break;
            default:
        }
        return num
    }
    useEffect(() => {
        fetch("/api/selectedMonthDashboard", {
            method: 'POST',
            body: JSON.stringify({
                mes: date_to_number(selectedDate)
            })
        }).then((res) => {
            if (res.status === 200) {
                //console.log("subida de fecha exitosa",selectedDate," y su valor es: ",date_to_number(selectedDate))
            } else {
                console.log("Error al subir la fecha, el status es: ", res.status)
            }
        }
        )
    }, [selectedDate])
    return (
        <div className="selectGlobal__container">
            <div className="selectGlobal__head">
                Seleccione un mes
            </div>
            <div className="selectGlobal__body">
                <select className="" aria-label=""
                    onChange={(e) => setSelectedDate(e.target.value)}
                >
                    <option id="select__option" defaultValue>enero</option>
                    {dates.map((mes, key) => (
                        <option id="select__option" key={key}>{mes}</option>
                    ))}
                </select>
            </div>
        </div>
    );

};

export default SelectDateDashboard;
