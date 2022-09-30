import React, { useEffect, useState } from "react";
import LineChart from "./Graphs/LineChart2";
const DashboardPrediccion = (props) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({})
  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  useEffect(() => {
    if (isEmpty(props.data_prediccion)) {
      console.log("la data esta vacia")
      setLoading(true)
    } else {
      console.log(props.data_prediccion)
      setLoading(false)
    }
  }, [props.data_prediccion])

  return (
    <>{isEmpty(props.data_prediccion) ?
      <>vacio</>
      :
      <LineChart
        scores={props.data_prediccion['resultados']}
        labels={props.data_prediccion['dates_array']}
        scoresF={props.data_prediccion['resultados']}
        legendFunction={"Regresion lineal"}
        legendData={"Posibles llamadas"}
      />

    }
    </>
  );

}

export default DashboardPrediccion;
