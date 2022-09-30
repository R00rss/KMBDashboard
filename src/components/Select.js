import React, { useEffect, useState } from "react";
import "./Select.css";
const Select = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const dates = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "octubre",
    "septiembre",
    "noviembre",
    "diciembre",
  ];

  function date_to_number(month) {
    let num = "-1";
    switch (month) {
      case "enero":
        num = "01";
        break;
      case "febrero":
        num = "02";
        break;
      case "marzo":
        num = "03";
        break;
      case "abril":
        num = "04";
        break;
      case "mayo":
        num = "05";
        break;
      case "junio":
        num = "06";
        break;
      case "julio":
        num = "07";
        break;
      case "agosto":
        num = "08";
        break;
      case "octubre":
        num = "09";
        break;
      case "septiembre":
        num = "10";
        break;
      case "noviembre":
        num = "11";
        break;
      case "diciembre":
        num = "12";
        break;
      default:
    }
    return num;
  }
  useEffect(() => {
    fetch("/api/selectedMonth", {
      method: "POST",
      body: JSON.stringify({
        mes: date_to_number(selectedDate),
      }),
    }).then((res) => {
      if (res.status === 200) {
        console.log("subida de fecha exitosa y su valor es: ", selectedDate);
      } else {
        console.log("Error al subir la fecha, el status es: ", res.status);
      }
    });
  }, [selectedDate]);
  return (
    <div className="select__container">
      <div className="select__head">
        Seleccione un mes para realizar la revisión
      </div>
      <div className="select__body">
        <select
          className=""
          aria-label=""
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          <option id="select__option" defaultValue>
            Elija un mes
          </option>
          {dates.map((mes, key) => (
            <option id="select__option" key={key}>
              {mes}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Select;
