import React from 'react'
//import TablaReporte from './TablaReporte'
import TablaReporteContent2 from './TablaReporteContent2'
import "./ReporteFacturacion.css"
const ReporteFacturacion = (props) => {
  return (
    <div className='ReporteFacturacion__container'>
        <TablaReporteContent2 data = {props.data}/>
    </div>
  )
}

export default ReporteFacturacion