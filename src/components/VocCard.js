import React from 'react'
import './VosCard.css'
import capitalizeFirstLetterWords, { capitalizeFirstLetterParagraph } from '../functions/FormatNames'
const VocCard = ({ estado, calificacion, mensaje, fecha, nombre, onClick, id,agente,cedula }) => {
  return (
    <div id={`${id}`} className='VocCard__container' onClick={() => onClick(id)}>
      <article className="titulo__container">
        <label className='lb_agente'><strong>{agente}</strong></label>
        <label className='lb_fecha'><strong>{fecha}</strong></label>
        <label className='lb_estado'><strong>{estado}</strong></label>
        <label className='lb_cedula'><strong>{cedula}</strong></label>
        <label className='lb_nombre'><strong>{capitalizeFirstLetterWords(nombre)}</strong></label>
        {/* <label className='lb_estado'><strong>{estado}</strong></label> */}
        {/* <label className='lb_calificacion'><strong>Calificación </strong>{calificacion}</label> */}
        {/* <label className='lb_fecha'><strong>{calificacion}</strong></label> */}
      </article>
      <div className="content__container">
        <p>{capitalizeFirstLetterParagraph(mensaje)}</p>
      </div>
    </div>
  )
}

export default VocCard