import React, { useEffect, useState } from "react";
import styles from "../../styles/DashboardReportes.module.css";
import { PieChart } from "../Graphs/PieChart";
import colors from "../../functions/Constans";
import SelectPrimary from "../SelectPrimary";
import getLastDay, { monthToNumber } from "../../functions/manageDates";
import { formDataToPiechart } from "../../functions/FormatData";
import { isEmpty } from "../../functions/ArrayManage";
import { capitalizeFirstLetterParagraph } from "../../functions/FormatNames";
import SelectedCooperativa from "../SelectedCooperativa";

const Dashboard = ({ client }) => {
  //data de los motivos y submotivos

  const dates = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Octubre",
    "Septiembre",
    "Noviembre",
    "Diciembre",
  ];
  const [date, setDate] = useState("");
  const [cooperativa, setCooperativa] = useState("");
  const [dataMotivo, setDataMotivo] = useState([]);
  const [dataSubmotivo, setDataSubmotivo] = useState([]);
  const [cooperativas, setCooperativas] = useState([]);
  const [motivo, setMotivo] = useState({});
  const defaultOption = "Escoja una Opción";
  const defaultOptionCooperativa = "Escoja una Opción";
  let legendIslarge = false;
  const getDateFromSelect = (data) => setDate(data);
  const getDatePiechart = (data) => setMotivo(data);
  const getCooperativaFromSelect = (data) => setCooperativa(data);

  useEffect(() => {
    if (client === null) {
      fetch("/api/cooperativas")
        .then((resp) => {
          if (resp.status === 200) return resp.json();
          else alert("Error", resp.status);
        })
        .then((data) => {
          setCooperativas(data);
        });
    } // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (client !== null) setCooperativa(client);
  }, []);

  useEffect(() => {
    if (dates.includes(date) && cooperativa !== defaultOptionCooperativa) {
      console.log("date:", date);
      const month = monthToNumber(date);
      const ld = getLastDay(monthToNumber(date) - 1);
      fetchMotivo(
        `2022-${month}-01 00:00:00`,
        `2022-${month}-${ld} 23:59:59`,
        cooperativa
      );
    }
  }, [date, cooperativa]);

  useEffect(() => {
    if (
      dates.includes(date) &&
      !isEmpty(motivo) &&
      cooperativa !== defaultOptionCooperativa
    ) {
      const month = monthToNumber(date);
      const ld = getLastDay(monthToNumber(date) - 1);
      fetchSubMotivo(
        `2022-${month}-01 00:00:00`,
        `2022-${month}-${ld} 23:59:59`,
        cooperativa,
        motivo.id
      );
    }
  }, [motivo, cooperativa, date]);

  function fetchMotivo(dateI, dateF, cooperativa) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cooperativa: cooperativa,
        dateTimeI: dateI,
        dateTimeF: dateF,
        //motivo: "INFORMACION GENERAL"
      }),
    };
    fetch("/api/motivo", options)
      .then((resp) => {
        if (resp.status === 201) return resp.json();
        else {
          alert("error en los datos de request");
        }
      })
      .then((data) =>
        setDataMotivo(
          formDataToPiechart(
            data.map((item) => {
              return [capitalizeFirstLetterParagraph(item[0]), item[1]];
            })
          )
        )
      );
  }
  function fetchSubMotivo(dateI, dateF, cooperativa, motivo) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cooperativa: cooperativa,
        dateTimeI: dateI,
        dateTimeF: dateF,
        motivo: motivo,
      }),
    };
    fetch("/api/submotivo", options)
      .then((resp) => {
        if (resp.status === 201) return resp.json();
        else {
          alert("error en los datos de request");
        }
      })
      .then((data) => {
        console.log("submotivo data:", data);
        setDataSubmotivo(
          formDataToPiechart(
            data.map((item) => {
              if (item[0].length > 10) {
                legendIslarge = true;
              }
              return [capitalizeFirstLetterParagraph(item[0]), item[1]];
            })
          )
        );
        console.log(legendIslarge);
      });
  }

  return (
    <div className={`${styles.container}`}>
      <div className={styles.cooperativa}>
        <h1>{capitalizeFirstLetterParagraph(cooperativa)}</h1>
        <SelectedCooperativa logoname={cooperativa} />
      </div>
      <div className={`${styles.select_container}`}>
        <div className={styles.select}>
          <SelectPrimary
            title="Seleccione un mes"
            data={dates}
            defaultOption={defaultOption}
            callbackFunction={getDateFromSelect}
          />
        </div>
        {client === null ? (
          <div className={styles.select}>
            <SelectPrimary
              title="Seleccione una cooperativa"
              data={cooperativas}
              defaultOption={defaultOptionCooperativa}
              callbackFunction={getCooperativaFromSelect}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      <section className={styles.section}>
        {dataMotivo.length > 0 ? (
          <div className={styles.graphic_container}>
            <h2>Motivos</h2>
            <div className={`${styles.graphic}  ${styles.graphic1}`}>
              <PieChart
                data={dataMotivo}
                arcLinkLabelsTextColor={"#ffffff"}
                colors={colors}
                formattedValue={function (e) {
                  return e.value;
                }}
                arcLinkLabel={function (e) {
                  return e.value;
                }}
                margin={{ top: 15, right: 155, bottom: 15, left: 15 }}
                stylesPie={{
                  padAngle: 3,
                  cornerRadius: 6,
                  activeOuterRadiusOffset: 15,
                }}
                arrowStyles={{
                  SkipAngle: 360,
                  Offset: -5,
                  DiagonalLength: 15,
                  StraightLength: 4,
                  Thickness: 2,
                  RadiusOffset: 0.6,
                }}
                callbackFunction={getDatePiechart}
                legends_styles={[
                  {
                    anchor: "right",
                    direction: "column",
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemTextColor: "#ffffff",
                    itemDirection: "left-to-right",
                    itemOpacity: 1,
                    symbolSize: 10,
                    symbolShape: "circle",
                    effects: [
                      {
                        on: "hover",
                        style: {},
                      },
                    ],
                  },
                ]}
                theme={{
                  fontSize: "10px",
                  fontFamily: "Proxima Nova Ligth",
                }}
              />
            </div>
          </div>
        ) : (
          <></>
        )}
        {isEmpty(motivo) ? (
          <></>
        ) : (
          <div className={styles.graphic_container}>
            <h2>Submotivos de {motivo.id.toLowerCase()}</h2>
            <div className={`${styles.graphic} ${styles.graphic2}`} style={{}}>
              <PieChart
                data={dataSubmotivo}
                arcLinkLabelsTextColor={"#ffffff"}
                colors={colors}
                // formattedValue={function (e) { return e.value }}
                formattedValue={function (e) {
                  return e.value;
                }}
                arcLinkLabel={function (e) {
                  return e.value;
                }}
                margin={{ top: 15, right: 240, bottom: 15, left: 15 }}
                // margin={{ top: 15, right: 255, bottom: 1, left: 15 }}
                stylesPie={{
                  padAngle: 3,
                  cornerRadius: 6,
                  activeOuterRadiusOffset: 5,
                }}
                arrowStyles={{
                  SkipAngle: 360,
                  Offset: -5,
                  DiagonalLength: 15,
                  StraightLength: 4,
                  Thickness: 2,
                  RadiusOffset: 0.6,
                }}
                legends_styles={[
                  {
                    anchor: "right",
                    direction: "column",
                    justify: false,
                    translateX: 110,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemTextColor: "#ffffff",
                    itemDirection: "left-to-right",
                    itemOpacity: 1,
                    symbolSize: 10,
                    symbolShape: "circle",
                    effects: [
                      {
                        on: "hover",
                        style: {},
                      },
                    ],
                  },
                ]}
                // legends_styles={[]}
                theme={{
                  fontSize: "10px",
                  fontFamily: "Proxima Nova Ligth",
                }}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
