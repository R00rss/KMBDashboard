/*React*/
import React, { useEffect, useState } from 'react'
/*Componentes Propios importados */
import SelectPrimary from '../SelectPrimary'
/*Componentes para el datePicker */
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import { format } from 'date-fns';
/*Funciones importadas */
import getDataFromBackend from '../../functions/ApiFunctions';
import alertMessage from '../../functions/Messages';
import { mergeArraysFromId2 } from '../../functions/ArrayManage'
/*Estilos */
import './Dashboard5.css'
import SelectedCooperativa from '../SelectedCooperativa';
/*ESTILOS PARA LOS CALENDARIOS*/
import { estilos_calendario } from '../../functions/Constans';
/**Graficas */
import { BarChart } from '../Graphs/BarChart'
import swapNames from '../../functions/EvilFunctions';
const Dashboard5 = ({ client }) => {
  console.log('client', client)
  /*variables*/
  const [date, setDate] = useState(new Date())
  const [dateE, setDateE] = useState(new Date())
  const [cooperativas, setCooperativas] = useState("");
  const [selectedCooperativa, setSelectedCooperativa] = useState("");
  const [h_init, setH_init] = useState(new Date("march 25, 1995 00:00:00"))
  const [h_end, setH_end] = useState(new Date("march 25, 1995 23:59:59"))
  const [result, setResult] = useState({})
  const [dataBar, setDataBar] = useState([])
  const [keysData, setKeysData] = useState([])
  /*funciones*/
  const callBackCooperativa = (cooperativa) => setSelectedCooperativa(cooperativa)

  const getDataCallCenter = (date, h_init, h_end, cooperativa = "all") => {
    const bodyData = { "cooperativa": cooperativa, "date": date, 'h_init': h_init, 'h_end': h_end }
    fetch("/api/dashboardCallCenter", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyData)
    }).then(resp => {
      if (resp.status === 200) return (resp.json())
      else { alertMessage('error', 'Error', '¡Error en la respuesta del servidor call center!') }
    }
    ).then(data => setResult(data)).catch(error => { console.error("Error al enviar los datos:", error) })

  }
  /*Funciones que se ejecutan antes de que se renderice*/
  useEffect(() => {
    if (client === null) { getDataFromBackend("cooperativas", setCooperativas) }
    else { setSelectedCooperativa((client)) } // eslint-disable-next-line
  }, [])
  /*Funciones que se ejcutan cuando cambian variables*/
  useEffect(() => console.log('date:', format(date, "yyyy-MM-dd"), 'time:', format(date, "hh:mm a")), [date])
  useEffect(() => console.log('cooperativa:', selectedCooperativa), [selectedCooperativa])
  useEffect(() => {
    if ("consulta_dashbord5" in result) {
      const [aux1, aux2] = mergeArraysFromId2(result.consulta_dashbord5, ['OnQueue','Hangup'],{'Abandoned':'Abandonado','Success':'Atendida'});
      setDataBar(aux1)
      setKeysData(aux2)
      
    }
  }, [result])
  useEffect(() => console.log('dataBar', dataBar), [dataBar])
  useEffect(() => console.log('keysData', keysData), [keysData])


  useEffect(() => {
    console.log('selectedCooperativa', selectedCooperativa)
    if (selectedCooperativa !== "ALL") { getDataCallCenter(format(date, "yyyy-MM-dd"), format(h_init, "HH:mm"), format(h_end, "HH:mm"), swapNames(selectedCooperativa)) }
    else if (selectedCooperativa === "ALL") { getDataCallCenter(format(date, "yyyy-MM-dd"), format(h_init, "HH:mm"), format(h_end, "HH:mm")) }// eslint-disable-next-line
  }, [selectedCooperativa, date, h_init, h_end])

  return (
    <div className='dashboard5__container'>
      <div className="selects__containers">
        <div className="select_cooperativa">
          {client === null ?
            <SelectPrimary
              title="Seleccione una cooperativa"
              data={cooperativas}
              defaultOption="ALL"
              callbackFunction={callBackCooperativa}
            />
            : <></>
          }
          <SelectedCooperativa logoname={selectedCooperativa} styles={{ maxHeight: "80px" }} />
        </div>
        <div className="calendar__container">
          <div className="calendar__title__container">
            <label htmlFor="customRange1" >Selecione una Fecha</label>
          </div>
          <div className='calendar__box' style={{ flexDirection: 'column', gap: '0.5rem', height: 'auto', padding: '1rem 0' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                renderInput={(params) => (<TextField {...params} sx={estilos_calendario} />)}
                label="Fecha de Inicio"
                mask="__/__/____"
                inputFormat="dd/MM/yyyy"
                value={date}
                onChange={(date) => setDate(date)}
              />
              {/* <DatePicker
                renderInput={(params) => (<TextField {...params} sx={estilos_calendario} />)}
                label="Fecha de Fin"
                mask="__/__/____"
                inputFormat="dd/MM/yyyy"
                value={dateE}
                onChange={(date) => setDateE(date)}
              /> */}
              <TimePicker
                label="Hora de inicio"
                value={h_init}
                mask="__:__"
                inputFormat="HH:mm"
                onChange={(h_init) => setH_init(h_init)}
                renderInput={(params) => <TextField {...params} sx={estilos_calendario} />}
              />
              <TimePicker
                label="Hora de fin"
                value={h_end}
                mask="__:__"
                inputFormat="HH:mm"
                onChange={(h_end) => setH_end(h_end)}
                renderInput={(params) => <TextField {...params} sx={estilos_calendario} />}
              />
            </LocalizationProvider>
          </div>
        </div>

      </div>
      <div className="D5__graphic__container">
        {dataBar.length > 0 && keysData.length > 0 ?
          <>
            {client === null ?
              <h1 className='selected_cooperativa'>{selectedCooperativa === 'ALL' ? "Todas" : (selectedCooperativa)}</h1>
              :
              <h1 className='selected_cooperativa'>{client}</h1>
            }
            <div className="barGraphics_container">

              <BarChart padding={dataBar.length > 1 ? 0.2 : 0.7} data={dataBar} legend={{ "left": "Cantidad llamadas", "bottom": "Cooperativas" }} keys={keysData} />
            </div>
          </>
          :
          <></>
        }
      </div>
    </div>
  )
}

export default Dashboard5