import React from 'react'
import Table from './Table'
const TablaHome = (props) => {
    var client = ""
    if (props.client !== null && props.client !== "" &&props.client !== "Escoja una cooperativa"){
        client = props.client
    }
    const lastday = function (year = 2022, month) {
        return new Date(year, month, 0).getDate();
    }
    return (
        <div className='table__global__container'>
            {(props.date) ?
                ((props.date !== -1) & (props.date !== "{}") ?
                    <Table headers={["TIPO DE REPORTE:", "FACTURACIÓN"]} content={["CAMPAÑA:", client + " INBOUND", "DESDE", "01/" + props.date + "/2022", "HASTA", lastday("2022", props.date) + "/" + props.date + "/2022"]} />
                    : <Table headers={["TIPO DE REPORTE:", "FACTURACIÓN"]} content={["CAMPAÑA:", client + " INBOUND", "DESDE", "fecha no ingresada", "HASTA", "fecha no ingresada"]} />)
                : <Table headers={["TIPO DE REPORTE:", "FACTURACIÓN"]} content={["CAMPAÑA:", client + " INBOUND", "DESDE", "No se han podido cargar los datos", "HASTA", "No se han podido cargar los datos"]} />
            }
        </div>
    )
}

export default TablaHome