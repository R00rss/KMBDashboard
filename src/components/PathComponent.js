import React from 'react'
import "./PathComponent.css"
const PathComponent = ({ opcion1 = "", opcion2 = "", opcion3 = "", opcion4 = "", opcion5 = "", opcion6 = "" }) => {
  return (
    <div className='path'>
      {opcion1 === "" || opcion1 === "Escoja una Opción" ? "" : opcion1 + "/"}
      {opcion2 === "" || opcion2 === "Escoja una Cooperativa" ? "" : opcion2 + "/"}
      {opcion3 === "" || opcion3 === "Escoja una Opción" ? "" : opcion3 + "/"}
      {opcion4 === "" || opcion4 === "Escoja un año" ? "" : opcion4 + "/"}
      {opcion5 === "" || opcion5 === "Escoja un Mes" ? "" : opcion5 + "/"}
      {opcion6 === "" || opcion6 === "Escoja un día" ? "" : opcion6}
    </div>
  )
}

export default PathComponent