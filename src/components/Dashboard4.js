import React, { useEffect, useState } from "react";
import "./Dashboard4.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { PieChart } from "./Graphs/PieChart";
import LoadingComponent from "./LoadingComponent";
import VocCard from "./VocCard";
import { isEmpty } from "../functions/ArrayManage";
import { formDataPolarity } from "../functions/FormatData";
import VocCard2 from "./VocCard2";
import SelectPrimary from "./SelectPrimary";
import colors from "../functions/Constans";
import getDataFromBackend from "../functions/ApiFunctions";
import SelectedCooperativa from "./SelectedCooperativa";
import ExcelVoc from "./ToExcel/ExcelVoc";
import { swapNames3 } from "../functions/EvilFunctions";

const Dashboard4 = ({ client }) => {
  //const cooperativas = ["OSCUS", "DAQUILEMA"];
  const MySwal = withReactContent(Swal);
  const [loading, setLoading] = useState(false);
  const [individualVOC, setIndividualVOC] = useState({});
  const [data, setData] = useState({});
  const [estados, setEstados] = useState({});
  const [selectedCooperativa, setSelectedCooperativa] = useState("");
  const [cooperativas, setCooperativas] = useState("");
  const [textToSearch, setTextToSearch] = useState("");
  const [estadosVOC, setEstadosVOC] = useState({});
  const [button1, setbutton1] = useState(true);
  const [button2, setbutton2] = useState(false);
  const callBackCooperativa = (cooperativa) =>
    setSelectedCooperativa(cooperativa);
  const formatDataToPiechart = (estados) => {
    let auxData = [];
    estados.forEach((estado) => {
      auxData.push({
        id: estado[0], //nombre del status
        value: estado[1], //valor del status en segundos
        label: estado[0], // titulo de la legenda (valor en date time)
        color: "hsl(95, 70%, 50%)",
      });
    });
    return auxData;
  };
  const swapButtons = (setbuttonOn, setbuttonOff) => {
    setbuttonOn(true);
    setbuttonOff(false);
  };

  /**setData */
  const getEstados = (cooperativa = "all") => {
    const bodyData = {
      cooperativa: cooperativa,
    };
    fetch("/api/dashboardVOC", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    })
      .then((resp) => {
        if (resp.status === 200) return resp.json();
        else {
          MySwal.fire({
            icon: "error",
            title: "Error",
            text: "¡Error en la respuesta del servidor!",
          });
        }
      })
      .then((data) => {
        setData(data);
      })
      .then()
      .catch((error) => {
        console.error("Error al enviar los datos:", error);
      });
  };
  const getEstadosrrss = (cooperativa = "all") => {
    console.log("test123", cooperativa);
    const bodyData = {
      cooperativa: cooperativa,
    };
    fetch("/api/dashboardVOCrrss", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    })
      .then((resp) => {
        if (resp.status === 200) return resp.json();
        else {
          MySwal.fire({
            icon: "error",
            title: "Error",
            text: "¡Error en la respuesta del servidor!",
          });
        }
      })
      .then((data) => {
        console.log("___________________________________dataesatosrrsss", data);
        setData(data);
      })
      .then()
      .catch((error) => {
        console.error("Error al enviar los datos:", error);
      });
  };
  /**setIndividualVOC */
  const getMessage = (id) => {
    setLoading(true);
    fetch("/api/dashboardVOC", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_llamada: id }),
    })
      .then((resp) => {
        if (resp.status === 200) return resp.json();
        else {
          MySwal.fire({
            icon: "error",
            title: "Error",
            text: "¡Error en la respuesta del servidor!",
          });
        }
      })
      .then((data) => {
        setIndividualVOC(data);
      })
      .then(setLoading(false))
      .catch((error) => {
        console.error("Error al enviar los datos:", error);
      });
  };
  const getMessageRrss = (id) => {
    setLoading(true);
    fetch("/api/dashboardVOCrrss", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_rrss: id }),
    })
      .then((resp) => {
        if (resp.status === 200) return resp.json();
        else {
          MySwal.fire({
            icon: "error",
            title: "Error",
            text: "¡Error en la respuesta del servidor!",
          });
        }
      })
      .then((data) => {
        setIndividualVOC(data);
      })
      .then(setLoading(false))
      .catch((error) => {
        console.error("Error al enviar los datos:", error);
      });
  };

  // useEffect(() => console.log(`333-cambia: loading ${loading}`), [loading]);
  // useEffect(
  //   () => console.log(`333-cambia: individualVOC ${individualVOC}`),
  //   [individualVOC]
  // );
  // useEffect(() => console.log(`333-cambia: data ${data}`), [data]);
  // useEffect(() => console.log(`333-cambia: estados ${estados}`), [estados]);
  // useEffect(
  //   () => console.log(`333-cambia: selectedCooperativa ${selectedCooperativa}`),
  //   [selectedCooperativa]
  // );
  // useEffect(
  //   () => console.log(`333-cambia: cooperativas ${cooperativas}`),
  //   [cooperativas]
  // );
  // useEffect(
  //   () => console.log(`333-cambia: textToSearch ${textToSearch}`),
  //   [textToSearch]
  // );
  // useEffect(
  //   () => console.log(`333-cambia: estadosVOC ${JSON.stringify(estadosVOC)}`),
  //   [estadosVOC]
  // );

  /**cambia data -> cambia Estados y EstadosVOC */
  useEffect(() => {
    if (button1) {
      if ("consulta_estados" in data && "consulta_VOC" in data) {
        setEstados(formatDataToPiechart(data.consulta_estados));
        setEstadosVOC(data.consulta_VOC);
      }
    } else if (button2) {
      if ("consulta_rrss_estados" in data && "consulta_rrss" in data) {
        setEstados(formatDataToPiechart(data.consulta_rrss_estados));
        setEstadosVOC(data.consulta_rrss);
      }
    }
    console.log("estados", estados);
    console.log("estadosVOC", estadosVOC);
    console.log("data", data);
  }, [data]);

  useEffect(() => {
    console.log(individualVOC);
    console.log(loading);
    console.log(isEmpty(individualVOC));
  }, [individualVOC]);

  useEffect(() => console.log("new render"));

  /**  [] -> cambia cooperativas o cambia selected cooperativa */
  useEffect(() => {
    setTextToSearch("");
    // setIndividualVOC({});
    if (client === null) {
      if (button1) {
        getDataFromBackend("cooperativas", setCooperativas);
      } else if (button2) {
        getDataFromBackend("cooperativas_rrss", setCooperativas);
      }
    } else {
      setSelectedCooperativa(client);
    } // eslint-disable-next-line
  }, [button1, button2]);
  useEffect(() => console.log("654", button1, button2), [button1, button2]);

  /**  cambia selectedCooperativa -> cambia Data */
  useEffect(() => {
    if (selectedCooperativa !== "ALL") {
      if (button1) {
        getEstados(selectedCooperativa);
      } else if (button2) {
        getEstadosrrss(selectedCooperativa);
      }
    } else if (selectedCooperativa === "ALL") {
      if (button1) {
        getEstados();
      } else if (button2) {
        console.log("entra a button 2 y entra a getestaosrsss");
        getEstadosrrss();
      }
    } // eslint-disable-next-line
  }, [selectedCooperativa, button1, button2]);

  return (
    <div className="dashboard4__container">
      {client === null ? (
        <div className="select__container">
          <SelectPrimary
            title="Seleccione una cooperativa"
            data={cooperativas}
            defaultOption="ALL"
            callbackFunction={callBackCooperativa}
          />
          <SelectedCooperativa
            logoname={selectedCooperativa}
            styles={{ maxHeight: "70px" }}
          />
        </div>
      ) : (
        <div className="select__container2">
          <h1>{selectedCooperativa}</h1>
          <SelectedCooperativa
            logoname={selectedCooperativa}
            styles={{ maxHeight: "70px" }}
          />
        </div>
      )}

      {estados.length > 0 ? (
        <>
          <ExcelVoc
            data={estadosVOC}
            file_name={
              selectedCooperativa === "ALL"
                ? "Reporte VOC"
                : "Reporte VOC " +
                  selectedCooperativa.replace("COOPERATIVA ", "")
            }
            client={
              selectedCooperativa === "ALL"
                ? "GENERAL"
                : selectedCooperativa.replace("COOPERATIVA ", "")
            }
          />
          <div className="voc_container">
            <div className="graphic">
              <h1>
                <strong>Estados clientes</strong>
              </h1>
              <div className="graphic__container">
                <PieChart
                  arcLinkLabelsTextColor={"#bdbdbd"}
                  colors={colors}
                  data={estados}
                  arcLinkLabel="id"
                  formattedValue={function (e) {
                    return e.value;
                  }}
                />
              </div>
            </div>
            <div className="voc__messages">
              <div>
                <h1 className="barra-messages-voc">
                  <strong>Mensajes Clientes</strong>
                  <div className="container-btns-voc">
                    <button
                      onClick={() => swapButtons(setbutton1, setbutton2)}
                      className={button1 ? "active-btn-voc" : ""}
                    >
                      Llamadas
                    </button>
                    <button
                      className={button2 ? "active-btn-voc" : ""}
                      onClick={() => swapButtons(setbutton2, setbutton1)}
                    >
                      Redes Sociales
                    </button>
                  </div>
                </h1>
              </div>
              <div className="input_search_voc_container">
                <label htmlFor="input_search_voc">Buscar:</label>
                <input
                  value={textToSearch}
                  onChange={(e) => setTextToSearch(e.target.value)}
                  name="input_search_voc"
                  type="text"
                  placeholder="nombre cliente - cedula"
                />
              </div>
              <div className="voc__messages__container">
                {
                  //estadosVOC.map((data) => <VocCard onClick={getMessage} key={data[5]} estado={data[0]} calificacion={data[1]} mensaje={data[2]} fecha={data[3]} nombre={data[4]} id={data[5]} agente={data[6]} />)
                  estadosVOC
                    .filter((item) => {
                      const matcher = new RegExp(
                        `${textToSearch.toLowerCase()}`
                      ); //expresion regular

                      if (textToSearch === "") {
                        return item;
                      } else if (button1) {
                        if (
                          /* matcher.test(item[0].toLowerCase()) ||//estado
                        matcher.test(item[1]) ||              //calificacion
                        matcher.test(item[3].toLowerCase()) ||//fecha */
                          matcher.test(item[4].toLowerCase()) || //nombre cliente
                          /*   matcher.test(item[5]) ||              //id de llamada
                        matcher.test(item[6].toLowerCase()) ||//nombre agente */
                          /* matcher.test(item[7].toLowerCase()) ||//hora 
                        matcher.test(item[8].toLowerCase()) ||//cooperativa */
                          matcher.test(item[9]?.toLowerCase()) //cedula
                        ) {
                          return item;
                        }
                      } else if (button2) {
                        if (
                          matcher.test(item[7].toLowerCase()) ||
                          matcher.test(item[3].toLowerCase()) ||
                          matcher.test(item[2].toLowerCase()) ||
                          matcher.test(item[4].toLowerCase())
                        ) {
                          return item;
                        }
                      }
                    })
                    .map((data) => {
                      if (button1) {
                        return (
                          <VocCard
                            onClick={getMessage}
                            key={data[5]}
                            estado={data[0]}
                            calificacion={data[1]}
                            mensaje={data[2]}
                            fecha={data[3]}
                            nombre={data[4]}
                            id={data[5]}
                            agente={data[6]}
                            cedula={data[9]}
                          />
                        );
                      } else if (button2) {
                        return (
                          <VocCard
                            onClick={getMessageRrss}
                            key={data[5]}
                            estado={data[0]}
                            calificacion={data[1]}
                            mensaje={data[2]}
                            fecha={data[3]}
                            nombre={data[6]}
                            id={data[5]}
                            agente={data[4]}
                            cedula={data[7]}
                          />
                        );
                      }
                    })
                }
              </div>
            </div>
            {!isEmpty(individualVOC) ? (
              loading ? (
                <LoadingComponent />
              ) : (
                <div className="individual_voc">
                  {console.log("individualVOC console", individualVOC)}
                  {button1 ? (
                    individualVOC.consulta_llamada && (
                      <VocCard2
                        nombre={individualVOC.consulta_llamada[4]}
                        estado={individualVOC.consulta_llamada[0]}
                        calificacion={individualVOC.consulta_llamada[1]}
                        mensaje={individualVOC.consulta_llamada[2]}
                        fecha={individualVOC.consulta_llamada[3]}
                        polaridad={formDataPolarity(individualVOC.polarity)}
                        agente={individualVOC.consulta_llamada[6]}
                        hora={individualVOC.consulta_llamada[7]}
                        cedula={individualVOC.consulta_llamada[9]}
                      />
                    )
                  ) : button2 ? (
                    individualVOC.consulta_rrss && (
                      <VocCard2
                        nombre={individualVOC.consulta_rrss[4]}
                        estado={individualVOC.consulta_rrss[0]}
                        calificacion={individualVOC.consulta_rrss[1]}
                        mensaje={individualVOC.consulta_rrss[2]}
                        fecha={individualVOC.consulta_rrss[3]}
                        polaridad={formDataPolarity(individualVOC.polarity)}
                        cedula={individualVOC.consulta_rrss[7]}
                      />
                    )
                  ) : (
                    <></>
                  )}
                </div>
              )
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
export default Dashboard4;
