/**Funcion para verificar que coincidan los nombre de cooperativas
 * ya que no se hizo una normalizacion de estos en la Base de datos
 * ejem:
 *  COOPERATIVA OSCUS === COOP_OSCUS
 *  COOP_MUSH === COOPERATIVA MUSHUC RUNA
 */
const swapNames = (name) => {
  switch (name) {
    case "COOPERATIVA OSCUS":
      return "COOP_OSCUS";
    case "COOPERATIVA TULCAN":
      return "COOP_TULCAN";
    case "COOPERATIVA MUSHUC RUNA":
      return "COOP_MUSHUC";
    case "COOPERATIVA DAQUILEMA":
      return "COOP_DAQUILEMA";
    case "COOPERATIVA CACPE GUALAQUIZA":
      return "COOP_CACPEG";
    case "COOPERATIVA SAN FRANCISCO":
      return "COOP_SANFRAN";
    case "COOPERATIVA PATUTAN":
      return "COOP_PATUTAN";
    case "COOPERATIVA CCCA":
      return "COOP_CCCA";
    case "COOPERATIVA GAÑANSOL":
      return "COOP_GANASOL";
    case "COOPERATIVA TENA":
      return "COOP_TENA";
    case "COOPERATIVA ZAMORA CHINCHIPE":
      return "ZAMORA";
    default:
      return "";
  }
};
export const swapNames3 = (name) => {
  switch (name) {
    case "COOPERATIVA TENA":
      return "Cooperativa Tena";
    case "COOPERATIVA CACPE GUALAQUIZA":
      return "Cooperativa CACPE Gualaquiza";
    case "COOPERATIVA DAQUILEMA":
      return "Cooperativa Daquilema";
    case "COOPERATIVA SAN FRANCISCO":
      return "Cooperativa San Francisco";
    case "COOPERATIVA PATUTAN":
      return "Cooperativa Patutan";
    case "COOPERATIVA ZAMORA CHINCHIPE":
      return "CACPE Zamora";
    default:
      return "";
  }
};
export const swapNames2 = (name) => {
  switch (name) {
    case "COOP_OSCUS":
      return "COOPERATIVA OSCUS";
    case "COOP_TULCAN":
      return "COOPERATIVA TULCAN";
    case "COOP_MUSHUC":
      return "COOPERATIVA MUSHUC RUNA";
    case "COOP_DAQUILEMA":
      return "COOPERATIVA DAQUILEMA";
    case "COOP_CACPEG":
      return "COOPERATIVA CACPE GUALAQUIZA";
    case "COOP_SANFRAN":
      return "COOPERATIVA SAN FRANCISCO";
    case "COOP_PATUTAN":
      return "COOPERATIVA PATUTAN";
    case "COOP_CCCA":
      return "COOPERATIVA CCCA";
    case "COOP_GANASOL":
      return "COOPERATIVA GAÑANSOL";
    case "COOP_TENA":
      return "COOPERATIVA TENA";
    case "ZAMORA":
      return "COOPERATIVA ZAMORA CHINCHIPE";
    default:
      return "";
  }
};
export default swapNames;
