import React from "react";
import capitalizeFirstLetterWords, {
  capitalizeFirstLetterParagraph,
} from "../functions/FormatNames";
import { PieChart } from "./Graphs/PieChart";
import "./VocCard2.css";

const colors = [
  /*green*/ "#5dd422",
  /*neon*/ "#22d490",
  /*red*/ "#d43a22",
  /*blue*/ "#2257d4",
  /*yellow*/ "#d4ad22",
  /*purple*/ "#9922d4",
  /*pink*/ "#d4224c",
];

const VocCard2 = ({
  estado,
  calificacion,
  mensaje,
  fecha,
  nombre,
  polaridad = [],
  agente = "",
  hora = "",
  cedula,
}) => {
  const customTooltip = ({ datum: { id, value, color, label } }) => (
    <div
      style={{
        padding: "0.5rem 1rem",
        color: "#bdbdbd;",
        background: "#222222",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: color,
          height: "1rem",
          aspectRatio: 1 / 1,
          marginRight: "1vw",
        }}
      ></div>
      <strong>{label}</strong>
    </div>
  );
  return (
    <div className="VocCard2__container">
      <article className="content_individual_voc">
        <div className="info_individual_voc">
          <div className="info_individual_datos">
            <h1>
              <strong>Nombre: </strong>
              {capitalizeFirstLetterWords(nombre)}
            </h1>
            <h1>
              <strong>Estado: </strong>
              {estado}
            </h1>
            <h1>
              <strong>Calificación: </strong>
              {calificacion}
            </h1>
            <h1>
              <strong>Fecha: </strong>
              {fecha}
            </h1>
            {hora === "" ? (
              <></>
            ) : (
              <h1>
                <strong>Hora: </strong>
                {hora}
              </h1>
            )}

            {agente === "" ? (
              <></>
            ) : (
              <h1>
                <strong>Agente: </strong>
                {agente}
              </h1>
            )}

            <h1>
              <strong>Cédula: </strong>
              {cedula}
            </h1>
          </div>
          <div className="message_individual_voc">
            <p>{capitalizeFirstLetterParagraph(mensaje)}</p>
          </div>
        </div>
        <div className="graphic__container">
          <h1>Análisis de sentimiento</h1>
          <div className="graphic_voc_individual">
            <PieChart
              arcLinkLabelsTextColor={"#bdbdbd"}
              colors={colors}
              theme={{
                fontSize: "0.75rem",
                fontFamily: "Proxima Nova Regular",
              }}
              arcLinkLabel={(e) => `${e.id}: ${e.value}%`}
              formattedValue={(e) => `${e.value}`}
              tooltip={customTooltip}
              data={polaridad}
            />
          </div>
        </div>
      </article>
    </div>
  );
};

export default VocCard2;
