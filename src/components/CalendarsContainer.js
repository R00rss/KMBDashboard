import "./CalendarContainer.css"
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useState } from "react";
/**Styles for calendar */
import { estilos_calendario } from "../functions/Constans";

const CalendarsContainer = (props) => {

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  function formatDate(date) {
    return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-');
  }
  const [value, setValue] = useState(formatDate(new Date()));
  const [value2, setValue2] = useState(formatDate(new Date()));

  useEffect(() => {
    props.callbackFunction({ "dateI": value, "dateE": value2 })
    return () => {
      console.log("calendar", value, value2)
    }  // eslint-disable-next-line
  }, [value, value2]
  )
  return (
    <div className="calendar__container">
      <div className="calendar__title__container">
        <label htmlFor="customRange1" >Seleccione la fecha para realizar la predicción</label>
      </div>
      <div className='calendar__box'>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            className="datepicker__container"
            label="Fecha de inicio"
            value={value}
            onChange={(newValue) => {
              setValue(formatDate(newValue));
            }}
            renderInput={(params) => <TextField {...params}
              sx={estilos_calendario} />}
          />
        </LocalizationProvider>

      </div>

      <div className='calendar__box'>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            className="datepicker__container"
            label="Fecha de fin"
            value={value2}
            onChange={(newValue) => {
              setValue2(formatDate(newValue));
            }}
            renderInput={(params) => <TextField {...params}
              sx={estilos_calendario}
            />}
          />
        </LocalizationProvider>
      </div>
    </div>
  )
}

export default CalendarsContainer