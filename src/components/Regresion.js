import React, { useEffect, useState } from 'react'
import DashboardPrediccion from './DashboardPrediccion'
import DashboardRegresion from './DashboardRegresion'
import "./Regresion.css"
import SelectPrimary from './SelectPrimary'
import CalendarsContainer from './CalendarsContainer'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import SelectedCooperativa from './SelectedCooperativa'
const Regresion = (props) => {
  const MySwal = withReactContent(Swal)
  const [dataCooperativa, setDataCooperativa] = useState({})
  const [selectedCooperativa, setSelectedCooperativa] = useState([])
  const [dataFromRegresion, setDataFromRegresion] = useState({})
  const [dates, setDates] = useState({})
  const [dataPrediccion, setDataPrediccion] = useState({})
  const [loading, setLoading] = useState(true)
  const getDataFromSelectedCooperativa = (data) => {
    setSelectedCooperativa(data)
  }
  const getDataFromRegresion = (data) => {
    setDataFromRegresion(data)
  }
  const getDateFromContainerCalendars = (data) => {
    setDates(data)
  }
  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  //USE EFECT PARA OBTENER LAS COOPERATIVAS DEL BACKEND
  useEffect(() => {
    if (props.client === null) {
      fetch("/api/cooperativas")
        .then(resp => {
          if (resp.status === 200) return (resp.json())
          else alert("Error", resp.status)
        }
        ).then(data_ => {
          setDataCooperativa(data_)
          console.log("cooperativas", dataCooperativa)

        });
    } else {
      setDataCooperativa([props.client])
    }
    // eslint-disable-next-line
  }, [])
  useEffect(() => {
    console.log(selectedCooperativa)
  }, [selectedCooperativa])

  useEffect(() => {
    console.log("data de la regresion", dataFromRegresion)
    if (typeof (dataFromRegresion) === 'string') {
      setLoading(true)
    } else if (isEmpty(dataFromRegresion)) {
      setLoading(true)
    } else {
      setLoading(false)
    }

  }, [dataFromRegresion])

  useEffect(() => {
    console.log("dataPrediccion", dataPrediccion)
  }, [dataPrediccion])

  useEffect(() => {
    console.log("dates", dates)
  }, [dates])

  useEffect(() => {
    if ("dateBase" in dataFromRegresion && "coeficientes" in dataFromRegresion) {
      if ("dateI" in dates && "dateE" in dates) {
        fetch("/api/predecir", {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            dateBase: dataFromRegresion['dateBase'],
            dateI: dates['dateI'],
            dateE: dates['dateE'],
            coeficientes: dataFromRegresion['coeficientes']
          })
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
          setDataPrediccion(data)
        }).then(
        ).catch(error => { console.error("Error al enviar los datos:", error) })
      }
    }// eslint-disable-next-line
  }, [dates, dataFromRegresion])

  return (
    <>
      <div className='main__container'>
        <div
          id={selectedCooperativa === "Escoja una Opción" ? "" : "dashboard__prediccion__container__on"}
          className="dashboard__prediccion__container">
          <div className={selectedCooperativa === "Escoja una Opción" ? 'select__prediccion__container col-5' : 'select__prediccion__container col-3'}>
            <SelectedCooperativa logoname={selectedCooperativa} />
            <SelectPrimary
              title="Seleccione una Cooperativa"
              data={dataCooperativa}
              defaultOption="Escoja una Opción"
              callbackFunction={getDataFromSelectedCooperativa}
            />
          </div>
          {
            selectedCooperativa === "Escoja una Opción" ?
              <></>
              :
              <div className='col-9 dashboard__container'>
                <DashboardRegresion cooperativa={selectedCooperativa} callbackFunction={getDataFromRegresion} />
              </div>
          }
        </div>
      </div>
      {loading === true ?
        <></>
        : selectedCooperativa === "Escoja una Opción" ? <></>
          :
          <div className='main__container'>
            <div id='dashboard__prediccion__container__on' className="dashboard__prediccion__container">
              <div className='calendar__prediccion__container col-3'>
                <CalendarsContainer callbackFunction={getDateFromContainerCalendars} />
              </div>
              <div className='col-9 dashboard__container'>
                <DashboardPrediccion data_prediccion={dataPrediccion} />
              </div>
            </div>
          </div>

      }
    </>
  )
}

export default Regresion