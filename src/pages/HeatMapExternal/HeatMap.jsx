import styles from "./HeatMap.module.css";
import returnData from "./data";
const HeatMap = () => {
  //const [data, setData] = useState([]);

  /* useEffect(() => {
    fetch("api/cooperativas")
      .then((res) => (res.status === 200 ? res.json() : null))
      .then((data) => setData(data));
  }, []); */

  function sendDataIFrame2() {
    const frame = document.getElementById("frameHeatMap");
    const data = returnData().map(
      (item) =>
        `${item.PaisDomicilio}, ${item.CiudadDomicilio}, ${item.DireccionDomicilio}`
    );
    // console.log("123data", data);
    // const direcciones = ["Quito, Selva Alegre", "Quito, Ruiz de Castilla"];
    frame.contentWindow.postMessage(data, "*");
  }
  return (
    <div className={styles.container}>
      <div className={styles.externalPage}>
        <iframe
          title="heat map"
          id="frameHeatMap"
          src="http://127.0.0.1:8080/"
          scrolling="no"
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        ></iframe>
      </div>
      <div className={styles.button_container}>
        <button className={styles.button} onClick={sendDataIFrame2}>
          <p>Cargar datos</p>
        </button>
      </div>
    </div>
  );
};

export default HeatMap;
