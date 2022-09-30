import React, { useEffect, useState } from "react";
import LineChart from "./Graphs/LineChart2";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import LoadingComponent from "./LoadingComponent";
const DashboardRegresion = (props) => {
  const [dataRegresion, setDataRegresion] = useState({});
  const MySwal = withReactContent(Swal)
  const [loading, setLoading] = useState(false)
  function crearFuncion(m, b, labels) {
    var totalLabels = []
    for (const label in labels) {
      var aux = m * label + b
      totalLabels.push(aux)
    }
    return totalLabels
  }
  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const consultar_datos_regresion = (cooperativa) => {
    setLoading(true)
    console.log("se inicio la consulta con:", cooperativa)
    fetch("/api/regresion", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cooperativa: String(cooperativa)
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
      setDataRegresion(data)
    }).then(
      setLoading(false)
    ).catch(error => { console.error("Error al enviar los datos:", error) })
  };
  useEffect(() => {
    console.log("data regresion:", dataRegresion)
    if (typeof (dataRegresion) !== 'string') {
      if (isEmpty(dataRegresion)) {
        console.log("data regresion esta vacio")
      } else if ("coeficientes" in dataRegresion['result']) {
        props.callbackFunction(
          {
            "coeficientes": dataRegresion['result']['coeficientes'],
            "dateBase": dataRegresion['result']['dateI'],
          }
        )
      }
    }
  }, [dataRegresion]
  )
  useEffect(() => {
    if (props.cooperativa !== "Escoja una Opción" && props.cooperativa !== "") {
      consultar_datos_regresion(props.cooperativa)
      console.log(props.cooperativa)
    }
  }, [props.cooperativa]
  )
  return (
    <>
      {loading === true ?
        <LoadingComponent />
        :
        typeof (dataRegresion) !== 'string' && "result" in dataRegresion ?
          <LineChart
            scores={dataRegresion['result']['num_call']}
            labels={dataRegresion['result']['date_call']}
            scoresF={crearFuncion(dataRegresion['result']['coeficientes']['m'], dataRegresion['result']['coeficientes']['b'], dataRegresion['result']['x_array'])}
            legendFunction={"Regresion Lineal"}
            legendData={"Numero de Llamadas obtenidas"}
          />
          :
          <>
            <LoadingComponent />
          </>

      }
    </>
  );
}

export default DashboardRegresion;
