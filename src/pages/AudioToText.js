import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import FailPage from "./FailPage";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./AudioToText.css";
import LoadingComponent from "../components/LoadingComponent";
import { PieChart } from "../components/Graphs/PieChart";
const AudioToText = () => {
  const [selectedFile, setSelectedFile] = useState();
  const MySwal = withReactContent(Swal);
  const [text, setText] = useState("");
  const [polarity, setPolarity] = useState({});
  const [loading, setLoading] = useState(false);
  const [fileIsSelected, setFileIsSelected] = useState(false);
  const validate = sessionStorage.getItem("Validate");
  const status = parseInt(sessionStorage.getItem("Status"));
  const client = sessionStorage.getItem("Client");
  // const estados_polarizacion = { compound: "complejo", neg: "negativo", neu: "neutro", pos: "positivo" };
  const estados_polarizacion = {
    neg: "Negativo",
    neu: "Neutro",
    pos: "Positivo",
  };
  const customTooltip = ({ datum: { id, value, color, label } }) => (
    <div
      style={{
        padding: "0.5rem 1rem",
        color: "#ffffff",
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
  const formData = (obj) => {
    const auxData = [];
    Object.entries(obj).forEach(([key, value], iteration) => {
      if (value > 0) {
        if (key in estados_polarizacion) {
          auxData.push({
            id: estados_polarizacion[key], //nombre del status
            value: (value * 100).toFixed(2), //valor del status en segundos
            label: estados_polarizacion[key], // titulo de la legenda (valor en date time)
          });
        }
      }
    });
    return auxData;
  };
  useEffect(() => {
    document.getElementById("title__page").innerHTML = "KMB | Audio a Texto";
  }, []);
  useEffect(() => {
    console.log(selectedFile);
  }, [selectedFile]);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setText("");
    setPolarity({});
    setFileIsSelected(true);
  };
  const handleClic = (e) => {
    e.preventDefault();
    if (fileIsSelected) {
      setLoading(true);
      let formData = new FormData();
      formData.append("audio_file", selectedFile);
      fetch("/api/audio_to_text", {
        method: "POST",
        body: formData,
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
          console.log(data);
          if ("text" in data) {
            setText(data.text);
          }
          if ("polarity" in data) {
            setPolarity(data.polarity);
          }
          setLoading(false);
        })
        .catch((error) => {
          setText(error).then(
            console.error("Error al enviar los datos:", error)
          );
        });
    } else {
      MySwal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "¡Debe ingresar un archivo!",
      });
    }
  };

  useEffect(() => {
    console.log("el valor de loading es: " + loading);
  }, [loading]);
  useEffect(() => {
    console.log("el valor de polarity es: " + JSON.stringify(polarity));
  }, [polarity]);

  return (
    <div>
      {validate !== "true" ? (
        <FailPage />
      ) : (
        <div className="audioToText_container">
          <Navbar selected={"AudioToText"} />
          <div className="dashboard_selectors">
            <label>Audio a texto</label>
          </div>
          <div className="content">
            <div className="input__container">
              <input
                type="file"
                name="file"
                onChange={(e) => changeHandler(e)}
              />
              <button
                className="btn_AudioToText"
                onClick={(e) => handleClic(e)}
              >
                Audio a texto
              </button>
            </div>
            {loading ? (
              <LoadingComponent />
            ) : Object.keys(polarity).length > 0 ? (
              <div className="result__container">
                <article className="text__container">
                  <h4>Texto obtenido del audio:</h4>
                  <p>{text}</p>
                </article>
                <div className="polatity__container">
                  <h4>Analisis de sentimiento:</h4>
                  <div className="graphic__container">
                    <PieChart
                      theme={{
                        fontSize: "0.75rem",
                        fontFamily: "Proxima Nova Regular",
                      }}
                      arcLinkLabel={(e) => `${e.id}: ${e.value}%`}
                      formattedValue={(e) => `${e.value}`}
                      tooltip={customTooltip}
                      data={formData(polarity)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioToText;
