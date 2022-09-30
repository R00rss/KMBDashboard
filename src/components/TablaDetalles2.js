import React from 'react'
import ExcelExport2 from './ExcelExport2';
import "./TablaDetalles.css"
const TablaDetalles2 = (props) => {
    //const headers = ["CIUDAD", "TELEFONO DE CONTACTO", "CELULAR DE CONTACTO", "CORREO", "ESTADO DEL CLIENTE", "MOTIVO DE LLAMADA", "SUBMOTIVO", "OBSERVACIÓNES"]
    const headers = [
        "  Usuario/Agente  ",
        "  Fecha llamada  ",
        "  Hora de llamada  ",
        "  Hora de fin  ",
        "  TMO  ",
        "  Estado llamada  ",
        "  Numero de cedula  ",
        "  Apellidos y nombres  ",
        "  Ciudad  ",
        "  Telefono de contacto  ",
        "  Celular de contacto  ",
        "  Correo  ",
        "  Estado del Cliente  ",
        "  Motivo de llamada  ",
        "  Submotivo  ",
        "  Observaciones  "
    ]
    return (
        <div className='tabla__detalles__container'>
            {!(props.data) ? "" :
                (props.data.length <= 0) ? "" :
                    <>
                        <div className='table_scroll'>
                            <table id="tableDetalleReporte-to-xls" className="table__global">
                                <thead className="">
                                    <tr>
                                        {headers.map((name, key) => (<th key={key}>{name}</th>))}
                                    </tr>
                                </thead>
                                <tbody className=''>{
                                    props.data.map((cont, key) =>
                                        <tr key={key}>
                                            {cont.map((data, i) => (<td key={i}>{data}</td>))}
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                        {/* <div className="btn__toExcel__container">
                            <ExcelExport2 dataReporte={props.dataReporte} data={props.data} client={props.client} />
                        </div> */}
                    </>
            }
        </div>
    )
}

export default TablaDetalles2