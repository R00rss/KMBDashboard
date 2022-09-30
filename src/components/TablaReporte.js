import React, { useEffect, useState } from 'react'
import Table from './Table'
const TablaReporte = () => {
    const [date, setDate] = useState("-1");
    const [count, setCount] = useState(0);
    const consultar_fecha = () => {
        fetch("/api/selectedMonth")
            .then((res) => res.json())
            .then((data) => {
                setDate(data);
                //console.log("fetch:", date);
            });
    };

    useEffect(() => {
        consultar_fecha()
        //console.log("useeffect date:", date, "y la hora:", new Date().toLocaleTimeString())
        setTimeout(() => {
            setCount((count) => count + 1);
        }, 1000);
    }, [count]
    )

    return (
        <div className='tabla__reporte'>
            {((date['mes'])) ?
                ((date['mes'] !== "-1") & (date['mes'] !== "{}")) ?
                    <Table headers={["CAMPAÑA:", "REPORTE DE FACTURACIÓN"]} content={["TIPO DE REPORTE", "MENSUAL", "CAMPAÑA", "CACPEG INBOUND", "DESDE", "01/" + date['mes'] + "/2022", "HASTA", date['ult_dia'] + "/" + date['mes'] + "/2022"]} />
                    : <Table headers={["CAMPAÑA:", "REPORTE DE FACTURACIÓN"]} content={["TIPO DE REPORTE", "MENSUAL", "CAMPAÑA", "CACPEG INBOUND", "DESDE", "fecha no ingresada", "HASTA", "fecha no ingresada"]} />
                : <Table headers={["CAMPAÑA:", "REPORTE DE FACTURACIÓN"]} content={["TIPO DE REPORTE", "MENSUAL", "CAMPAÑA", "CACPEG INBOUND", "DESDE", "No se ha podido ingresar los datos", "HASTA", "No se ha podido ingresar los datos"]} />
            }
        </div>
    )
}

export default TablaReporte