import './Reportes.css';
import HomeReportes2 from '../components/HomeReportes2';
import ReportesFacturacion2 from '../components/ReporteFacturacion2'
import DetallesReportes2 from '../components/DetallesReportes2'
import FailPage from './FailPage';
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ExcelExport2 from '../components/ExcelExport2';
import Dashboard from '../components/Reportes/Dashboard';
function Reportes2() {
    function date_to_number(month) {
        let num = -1
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
    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
    const validate = sessionStorage.getItem("Validate")
    const MySwal = withReactContent(Swal)
    const [dataDetalles, setDataDetalles] = useState({});
    const [tab1, setTab1] = useState(true);
    const [tab2, setTab2] = useState(false);
    const [dataReporte, setDataReporte] = useState("loading");
    const [date, setDate] = useState(-1);
    const [selectedCooperativa, setSelectedCooperativa] = useState("");
    var client = sessionStorage.getItem("Client")
    if (client === "") {
        client = null
    }
    const status = parseInt(sessionStorage.getItem("Status"))

    const getDateFromHomeReportes = (date, cooperativa) => {
        setDate(date)
        setSelectedCooperativa(cooperativa)
    }
    const consultarDetalles = (mes, cooperativa = "") => {
        fetch("/api/detalles_reporte", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cooperativa: cooperativa,
                mes: String(mes)
            })
        }).then(resp => {
            if (resp.status === 200) return (resp.json())
            else {
                MySwal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: '¡Error en la respuesta del servidor!'
                })
            }
        }
        ).then(data => {
            setDataDetalles(data)
        }).then(
        ).catch(error => { console.error("Error al enviar los datos:", error) })

    };
    const consultarReportes = (mes, cooperativa = "") => {
        setDataReporte({})
        fetch("/api/reporte_diario", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cooperativa: cooperativa,
                mes: String(mes)
            })
        }).then(resp => {
            if (resp.status === 200) return (resp.json())
            else {
                MySwal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: '¡Error en la respuesta del servidor!'
                })
            }
        }
        ).then(data => {
            setDataReporte(data)
        }).then(

        ).catch(error => { console.error("Error al enviar los datos:", error) })

    };
    useEffect(() => {
        console.log("entro detalles")
        if (date_to_number(date) !== -1) {
            if (client === null) {
                if (selectedCooperativa !== "") consultarDetalles(date_to_number(date), selectedCooperativa)
            } else consultarDetalles(date_to_number(date), client)
        }
    }, [date, selectedCooperativa]
    )
    useEffect(() => {
        console.log("entro reportes")
        if (date_to_number(date) !== -1) {
            if (client === null) {
                if (selectedCooperativa !== "") consultarReportes(date_to_number(date), selectedCooperativa)
            } else consultarReportes(date_to_number(date), client)
        }
    }, [date, selectedCooperativa]
    )

    useEffect(() => {
        console.log("cambio en date y se busco los detalles:", dataDetalles)
    }, [dataDetalles])
    useEffect(() => {
        console.log("cambio en date y se busco los reportes:", dataReporte)
    }, [dataReporte])

    useEffect(() => {
        document.getElementById("title__page").innerHTML = "KMB | Reportes"
    }, [])
    const selectTab = (tap_number) => {
        if (tap_number === 1) {
            setTab1(true)
            setTab2(false)
        } else if (tap_number === 2) {
            setTab2(true)
            setTab1(false)
        }
    }
    return (
        <div className="reportes__container">
            {validate === 'true' ?
                <>
                    <Navbar selected={"Reportes"} />
                    <div className="dashboard_selectors">
                        <button
                            id={tab1 ? "activate" : ""}
                            onClick={() => selectTab(1)}
                            className='dashboarpage__btn dashboarpage__btn1 '>
                            Reportes
                        </button>
                        <button
                            id={tab2 ? "activate" : ""}
                            onClick={() => selectTab(2)}
                            className='dashboarpage__btn dashboarpage__btn2'>
                            Análisis Reportes
                        </button>
                    </div>
                    {tab1 ?
                        <>
                            <HomeReportes2 callbackFunction={getDateFromHomeReportes} client={client} />
                            <>
                                {!isEmpty(dataReporte) && !isEmpty(dataDetalles) ?
                                    client === null ? selectedCooperativa !== "" && selectedCooperativa !== "Escoja una cooperativa" ?
                                        <div className="btn__toExcel__container">
                                            <ExcelExport2 dataReporte={dataReporte} data={dataDetalles[0]} client={selectedCooperativa} />
                                        </div>
                                        :
                                        <></>
                                        :
                                        <div className="btn__toExcel__container">
                                            <ExcelExport2 dataReporte={dataReporte} data={dataDetalles[0]} client={client} />
                                        </div>
                                    :
                                    <></>
                                }
                            </>
                            <ReportesFacturacion2 data={dataReporte} />
                            <DetallesReportes2 data={dataDetalles[0]} dataReporte={dataReporte} client={client} />
                        </>
                        : tab2 ?
                            <div>
                                <Dashboard client={client}/>
                            </div>
                            :
                            <>no tab</>

                    }

                </>
                : <FailPage />}

        </div>
    );
}

export default Reportes2;