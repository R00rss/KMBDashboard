import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import Dashboard2 from "../components/Dashboard2";
import Dashboard3 from "../components/Dashboard3";
import Dashboard4 from "../components/Dashboard4";
import Dashboard5 from "../components/AnalisisLlamadasEstados/Dashboard5";
import LoadingComponent from "../components/LoadingComponent";
import Navbar from "../components/Navbar";
import SelectDateDashboard from "../components/SelectDateDashboard";
import SelectGlobal from "../components/SelectGlobal";
import "./DashboardPage.css";
import FailPage from "./FailPage";
import HeatMap from "./HeatMapExternal/HeatMap";

const DashboardPage = () => {
  const [dataAgente, setDataAgente] = useState({});
  const [dataCooperativa, setDataCooperativa] = useState({});
  const [data, setData] = useState({});
  const [dataPie, setDataPie] = useState({});
  const [selected, setSelected] = useState({});
  const [selectDashboard1, setSelectDashboard1] = useState(true);
  const [selectDashboard2, setSelectDashboard2] = useState(false);
  const [selectDashboard3, setSelectDashboard3] = useState(false);
  const [selectDashboard4, setSelectDashboard4] = useState(false);
  const [selectDashboard5, setSelectDashboard5] = useState(false);
  const [selectDashboard6, setSelectDashboard6] = useState(false);
  const [loading, setLoading] = useState(false);
  const validate = sessionStorage.getItem("Validate");
  const status = parseInt(sessionStorage.getItem("Status"));
  var client = sessionStorage.getItem("Client");
  if (client === "") {
    client = null;
  }
  const selectDashboard = (dashboard) => {
    if (dashboard === 1) {
      setSelectDashboard1(true);
      setSelectDashboard2(false);
      setSelectDashboard3(false);
      setSelectDashboard4(false);
      setSelectDashboard6(false);
      setSelectDashboard5(false);
    } else if (dashboard === 2) {
      setSelectDashboard1(false);
      setSelectDashboard2(true);
      setSelectDashboard3(false);
      setSelectDashboard4(false);
      setSelectDashboard6(false);
      setSelectDashboard5(false);
    } else if (dashboard === 3) {
      setSelectDashboard1(false);
      setSelectDashboard2(false);
      setSelectDashboard3(true);
      setSelectDashboard4(false);
      setSelectDashboard6(false);
      setSelectDashboard5(false);
    } else if (dashboard === 4) {
      setSelectDashboard1(false);
      setSelectDashboard2(false);
      setSelectDashboard3(false);
      setSelectDashboard4(true);
      setSelectDashboard6(false);
      setSelectDashboard5(false);
    } else if (dashboard === 5) {
      setSelectDashboard5(true);
      setSelectDashboard1(false);
      setSelectDashboard2(false);
      setSelectDashboard3(false);
      setSelectDashboard4(false);
      setSelectDashboard6(false);
    } else if (dashboard === 6) {
      setSelectDashboard5(false);
      setSelectDashboard1(false);
      setSelectDashboard2(false);
      setSelectDashboard3(false);
      setSelectDashboard4(false);
      setSelectDashboard6(true);
    }
  };

  const formatData = (data_) => {
    let dataResult = [{}];
    var data_diario_global = [];
    var data_diario_global_cooperativa = [];
    var data_llamadas_global = [];
    var data_llamadas_global_cooperativa = [];
    var data_llamadas_mes = [];
    var data_llamadas_mes_cooperativa = [];
    //var data_llamadas_global_cooperativa = [];
    var x = [];
    for (const [key, value] of Object.entries(data_)) {
      if (key === "dias") {
        value.forEach((dia, i) => {
          x.push(dia);
        });
      }
      if (/^llamadas_diario_mes_((0[1-9])|1[0-2])$/.test(key)) {
        value.forEach((llamada_global, i) => {
          if (llamada_global.length !== 0) {
            data_diario_global.push({ x: x[i], y: llamada_global[0][1] });
          } else {
            data_diario_global.push({ x: x[i], y: 0 });
          }
        });
      }
      if (/^llamadas_diario_mes_((0[1-9])|1[0-2])_cooperativa_/.test(key)) {
        value.forEach((llamada_cooperativa, i) => {
          if (llamada_cooperativa.length !== 0) {
            data_diario_global_cooperativa.push({
              x: x[i],
              y: llamada_cooperativa[0][1],
            });
          } else {
            data_diario_global_cooperativa.push({ x: x[i], y: 0 });
          }
        });
      }
      if (/^llamadas_global$/.test(key)) {
        value.forEach((llamadas_global, i) => {
          if (llamadas_global.length !== 0) {
            data_llamadas_global.push({
              id: llamadas_global[0],
              value: llamadas_global[1],
              label: llamadas_global[0],
              color: "hsl(95, 70%, 50%)",
            });
          }
        });
      }
      if (/^llamadas_global_cooperativa_/.test(key)) {
        value.forEach((llamadas_global, i) => {
          if (llamadas_global.length !== 0) {
            data_llamadas_global_cooperativa.push({
              id: llamadas_global[0],
              value: llamadas_global[1],
              label: llamadas_global[0],
              color: "hsl(95, 70%, 50%)",
            });
          }
        });
      }
      if (/^llamadas_mes_((0[1-9])|1[0-2])$/.test(key)) {
        value.forEach((llamadas_global, i) => {
          if (llamadas_global.length !== 0) {
            data_llamadas_mes.push({
              id: llamadas_global[0],
              value: llamadas_global[1],
              label: llamadas_global[0],
              color: "hsl(95, 70%, 50%)",
            });
          }
        });
      }
      if (/^llamadas_mes_((0[1-9])|1[0-2])_/.test(key)) {
        value.forEach((llamadas_global, i) => {
          if (llamadas_global.length !== 0) {
            data_llamadas_mes_cooperativa.push({
              id: llamadas_global[0],
              value: llamadas_global[1],
              label: llamadas_global[0],
              color: "hsl(95, 70%, 50%)",
            });
          }
        });
      }
    }
    dataResult[0] = {
      id: "Llamadas Cooperativa",
      data: data_diario_global_cooperativa,
    };
    dataResult[1] = { id: "Llamadas Totales", data: data_diario_global };

    const dataTotal = {
      data_lineal: [dataResult[0], dataResult[1]],
      data_pie: [
        data_llamadas_global,
        data_llamadas_global_cooperativa,
        data_llamadas_mes,
        data_llamadas_mes_cooperativa,
      ],
    };
    console.log("data result es: ", dataResult);
    console.log("data diario global es: ", data_diario_global_cooperativa);
    return dataTotal;
  };
  function getDataAgente() {
    setLoading(true);
    fetch("/api/dataDashboard")
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json();
        } else {
          alert("Error", resp.status);
        }
      })
      .then((data_) => {
        console.log("data para dashboard", data_);
        if (data_ !== "") {
          const auxData = formatData(data_["data"]);
          setData(auxData["data_lineal"]);
          setDataPie(auxData["data_pie"]);
          setSelected({
            agente: data_["data"]["agente"],
            cooperativa: data_["data"]["cooperativa"],
            mes: data_["data"]["mes"],
          });
          setLoading(false);
        } else {
          alert("Error, la data no contiene nada, ");
          setLoading(false);
        }
      });
  }
  useEffect(() => {
    fetch("/api/agentes")
      .then((resp) => {
        if (resp.status === 200) return resp.json();
        else alert("Error", resp.status);
      })
      .then((data_) => {
        setDataAgente(data_);
        console.log("agentes", dataAgente);
      }); // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if ((status === 1) | (status === 2)) {
      fetch("/api/cooperativas")
        .then((resp) => {
          if (resp.status === 200) return resp.json();
          else alert("Error", resp.status);
        })
        .then((data_) => {
          setDataCooperativa(data_);
          console.log("cooperativas", dataCooperativa);
        });
    } else if (status === 3) {
      setDataCooperativa([client]);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log("el valor de data es:", data);
  }, [data]);
  useEffect(() => {
    console.log("el valor de loading es:", loading);
  }, [loading]);

  useEffect(() => {
    document.getElementById("title__page").innerHTML = "KMB | Dashboard";
  }, []);

  const GeneratePage = () => {
    return (
      <div className="dashboardPage__container">
        <Navbar selected={"DashboardPage"} />
        <div className="dashboard_selectors">
          <button
            id={selectDashboard1 ? "activate" : ""}
            onClick={() => selectDashboard(1)}
            className="dashboarpage__btn dashboarpage__btn1 "
          >
            Análisis Individual Trx
          </button>

          <button
            id={selectDashboard2 ? "activate" : ""}
            onClick={() => selectDashboard(2)}
            className="dashboarpage__btn dashboarpage__btn2"
          >
            Análisis Global Trx
          </button>
          <button
            id={selectDashboard4 ? "activate" : ""}
            onClick={() => selectDashboard(4)}
            className="dashboarpage__btn dashboarpage__btn2"
          >
            Voz del Cliente
          </button>
          <button
            id={selectDashboard5 ? "activate" : ""}
            onClick={() => selectDashboard(5)}
            className="dashboarpage__btn dashboarpage__btn2"
          >
            Análisis Call Center
          </button>
          {status === 3 ? (
            <></>
          ) : (
            <button
              id={selectDashboard3 ? "activate" : ""}
              onClick={() => selectDashboard(3)}
              className="dashboarpage__btn"
            >
              Análisis Estados
            </button>
          )}
          <button
            id={selectDashboard6 ? "activate" : ""}
            onClick={() => selectDashboard(6)}
            className="dashboarpage__btn"
          >
            Mapa de calor
          </button>
        </div>
        {selectDashboard1 ? (
          <>
            <div className="selects__container">
              <SelectGlobal
                data={dataAgente}
                defaultOption={"Ingrese un Agente"}
                sendDataName="Agent"
                title="Seleccione un Agente"
              />
              <SelectGlobal
                data={dataCooperativa}
                defaultOption={"Ingrese una cooperativa"}
                sendDataName="CooperativaDashboard"
                title="Seleccione una Cooperativa"
              />
              <SelectDateDashboard />
            </div>
            <div className="dashboarpage__calcular__btn__container">
              <button
                onClick={() => getDataAgente()}
                className="dashboarpage__calcular__btn"
              >
                Calcular Eficiencia Individual
              </button>
            </div>
            <div className="dashboard__container col-12">
              {loading === true ? (
                <LoadingComponent />
              ) : (
                <Dashboard
                  data={data}
                  dataInfo={selected}
                  dataPie={dataPie}
                  client={client}
                />
              )}
            </div>
          </>
        ) : selectDashboard2 ? (
          <Dashboard2 client={client} />
        ) : selectDashboard3 ? (
          <Dashboard3 client={client} />
        ) : selectDashboard4 ? (
          <Dashboard4 client={client} />
        ) : selectDashboard5 ? (
          <Dashboard5 client={client} />
        ) : selectDashboard6 ? (
          <HeatMap />
        ) : (
          <></>
        )}
      </div>
    );
  };
  return (
    <>
      {validate !== "true" ? (
        <FailPage />
      ) : status === 3 ? (
        client === null ? (
          <FailPage />
        ) : (
          <GeneratePage />
        )
      ) : (
        <GeneratePage />
      )}
    </>
  );
};

export default DashboardPage;
