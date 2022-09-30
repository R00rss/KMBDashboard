import React from 'react'
import TablaDetalles2 from './TablaDetalles2'
import "./DetallesReportes.css"
const DetallesReportes2 = (props) => {
  return (
    <div className='DetallesReportes__container'>
      <TablaDetalles2 data ={props.data} dataReporte = {props.dataReporte} client ={props.client}/>

    </div>
  )
}

export default DetallesReportes2