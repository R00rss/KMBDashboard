export default function getLastDay(month, year = 2022) {// month: string->mm, year: string -> YYYY 
  var d = new Date(year, month + 1, 0);//enero -> 0 
  return d.getDate();
}

export function monthToStringNumber(month) {//string -> string
  let num = "-01"
  switch (month) {
    case "Enero":
      num = "01"
      break;
    case "Febrero":
      num = "02"
      break;
    case "Marzo":
      num = "03"
      break;
    case "Abril":
      num = "04"
      break;
    case "Mayo":
      num = "05"
      break;
    case "Junio":
      num = "06"
      break;
    case "Julio":
      num = "07"
      break;
    case "Agosto":
      num = "08"
      break;
    case "Octubre":
      num = "09"
      break;
    case "Septiembre":
      num = "10"
      break;
    case "Noviembre":
      num = "11"
      break;
    case "Diciembre":
      num = "12"
      break;
    default:
  }
  return num
}
export function monthToNumber(month) {//string -> number
  let num = -1;
  switch (month) {
    case "Enero":
      num = 1
      break;
    case "Febrero":
      num = 2
      break;
    case "Marzo":
      num = 3
      break;
    case "Abril":
      num = 4
      break;
    case "Mayo":
      num = 5
      break;
    case "Junio":
      num = 6
      break;
    case "Julio":
      num = 7
      break;
    case "Agosto":
      num = 8
      break;
    case "Octubre":
      num = 9
      break;
    case "Septiembre":
      num = 10
      break;
    case "Noviembre":
      num = 11
      break;
    case "Diciembre":
      num = 12
      break;
    default:
      num = -1
  }
  return num
}
export function StringNumberToMonth(number) {//string -> string
  let month = "Enero"
  switch (number) {
    case "01":
      month = "Enero"
      break;
    case "02":
      month = "Febrero"
      break;
    case "03":
      month = "Marzo"
      break;
    case "04":
      month = "Abril"
      break;
    case "05":
      month = "Mayo"
      break;
    case "06":
      month = "Junio"
      break;
    case "07":
      month = "Julio"
      break;
    case "08":
      month = "Agosto"
      break;
    case "09":
      month = "Octubre"
      break;
    case "10":
      month = "Septiembre"
      break;
    case "11":
      month = "Noviembre"
      break;
    case "12":
      month = "Diciembre"
      break;
    default:
  }
  return month
}

