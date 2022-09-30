import React from "react";
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import "./reactToExcel.css"

const ExcelExport2 = (props) => {
    console.log(props.data)
    var days_len = 10;
    if (props.dataReporte) {
        if ("dias" in props.dataReporte) {
            days_len = props.dataReporte['dias'].length
        }
    }
    const createDownLoadData = () => {
        handleExport().then((url) => {
            console.log(url);
            const downloadAnchorNode = document.createElement("a");
            downloadAnchorNode.setAttribute("href", url);
            downloadAnchorNode.setAttribute("download", "Reporte_"+props.client+"_KMB.xlsx");
            downloadAnchorNode.click();//click en el <a></a> para iniciar la descarga
            downloadAnchorNode.remove();//remove la etiqueta <a></a> despues de hacer click
        });
    };

    const workbook2blob = (workbook) => {
        const wopts = {
            bookType: "xlsx",
            bookSST: false,
            type: "binary",
        };

        const wbout = XLSX.write(workbook, wopts);

        // The application/octet-stream MIME type is used for unknown binary files.
        // It preserves the file contents, but requires the receiver to determine file type,
        // for example, from the filename extension.
        const blob = new Blob([s2ab(wbout)], {
            type: "application/octet-stream",
        });

        return blob;
    };

    const s2ab = (s) => {
        // The ArrayBuffer() constructor is used to create ArrayBuffer objects.
        // create an ArrayBuffer with a size in bytes
        const buf = new ArrayBuffer(s.length);

        console.log(buf);

        //create a 8 bit integer array
        const view = new Uint8Array(buf);

        console.log(view);
        //charCodeAt The charCodeAt() method returns an integer between 0 and 65535 representing the UTF-16 code
        for (let i = 0; i !== s.length; ++i) {
            console.log(s.charCodeAt(i));
            view[i] = s.charCodeAt(i);
        }

        return buf;
    };

    const handleExport = () => {
        const title = [
            {
            },
            {
                A: "",
                B: "",
                C: "",
                D: "",
                E: "REPORTE DE FACTURACIÓN INBOUND"
            },
            {
            }
        ];
        const tableReporteTitle = [
            {

            },
            {
                A: "",
                B: "",
                C: "",
                D: "",
                E: "CAMPAÑA:",
                F: "",
                G: props.client+" INBOUND",//DEBE TOMARSE DE LA DATA
                H: "",
            },
            {
                A: "",
                B: "",
                C: "",
                D: "",
                E: "TIPO DE REPORTE",
                F: "",
                G: "MENSUAL",
                H: ""

            },
            {
                A: "",
                B: "",
                C: "",
                D: "",
                E: "DESDE",
                F: "",
                G: "01/04/2022",//DEBE TOMARSE DE LA DATA
                H: "",
            },
            {
                A: "",
                B: "",
                C: "",
                D: "",
                E: "HASTA",
                F: "",
                G: "30/04/2022",//DEBE TOMARSE DE LA DATA
                H: ""

            }
        ];
        //PRIMERO SE INICIAN LOS HEADERS DE LA TABLA
        let table_reporte_general = [
            {
            },
            {
                D: "Fecha Facturación",
                E: "Llamadas Entrantes",
                F: "Contestadas",
                G: "Abandonadas",
                H: "Nivel de Servicio (SVL)",
                I: "Nivel de Abandono"
            },
        ];

        var TEntrantes = "";
        var TContestadas = "";
        var TAbandonadas = "";
        var PServicio = "";
        var PAbandono = "";
        props.dataReporte['dias'].forEach((dia, i) => {
            const d = dia;
            const llamadas_abandonadas = props.dataReporte['llamadas_abandonadas'][i][0][0];
            const llamadas_atendidas = props.dataReporte['llamadas_atendidas'][i][0][0];
            const llamadas_entrantes = props.dataReporte['llamadas_entrantes'][i][0][0];
            const nivel_abandono = props.dataReporte['nivel_abandono'][i];
            const nivel_servicio = props.dataReporte['nivel_servicio'][i];
            TEntrantes = props.dataReporte['TEntrantes'];
            TContestadas = props.dataReporte['TContestadas'];
            TAbandonadas = props.dataReporte['TAbandonadas'];
            PServicio = props.dataReporte['PServicio'];
            PAbandono = props.dataReporte['PAbandono'];
            table_reporte_general.push({
                D: d,
                E: llamadas_entrantes,
                F: llamadas_atendidas,
                G: llamadas_abandonadas,
                H: String(nivel_servicio).concat("%"),
                I: String(nivel_abandono).concat("%"),
            });
        });

        table_reporte_general.push({
            D: "Total de reporte:",
            E: TEntrantes,
            F: TContestadas,
            G: TAbandonadas,
            H: String(PServicio).concat("%"),
            I: String(PAbandono).concat("%")
        })
        const table_reporte_detalles_title = [
            {

            },
            {
                A: "",
                B: "",
                C: "",
                D: "",
                E: "",
                F: "REGISTRO DE LLAMADAS DEL MES",
                G: "",
                H: "",
                I: "",
            }
            ,
            {

            }
        ]
        let table_reporte_detalles = [
            {
            },
            {
                A: "USUARIO/AGENTE",
                B: "FECHA DE LLAMADA",
                C: "HORA DE LLAMADA",
                D: "HORA DE FIN",
                E: "TMO",
                F: "ESTADO DE LLAMADA",
                G: "NUMERO DE CEDULA",
                H: "APELLIDO Y NOMBRES",
                I: "CIUDAD",
                J: "TELEFONO DE CONTACTO",
                K: "CELULAR DE CONTACTO",
                L: "CORREO",
                M: "ESTADO DEL CLIENTE",
                N: "MOTIVO DE LLAMADA",
                O: "SUBMOTIVO DE LLAMADA",
                P: "OBSERVACIONES"
            },
        ];
        props.data.forEach((row) => {
            const agente = row[0];
            const fecha = row[1];
            const horaI = row[2];
            const horaF = row[3];
            const tiempo = row[4];
            const estadoLlamada = row[5];
            const identificacion = row[6];
            const nombre_cliente = row[7];
            const ciudad = row[8];
            const telefono = row[9];
            const celular = row[10];
            const correo = row[11];
            const estado_cliente = row[12];
            const motivo_llamada = row[13];
            const submotivo_llamada = row[14];
            const observaciones = row[15];

            table_reporte_detalles.push({
                A: agente,
                B: fecha,
                C: horaI,
                D: horaF,
                E: tiempo,
                F: estadoLlamada,
                G: identificacion,
                H: nombre_cliente,
                I: ciudad,
                J: telefono,
                K: celular,
                L: correo,
                M: estado_cliente,
                N: motivo_llamada,
                O: submotivo_llamada,
                P: observaciones,
            })
        });
        let table_reporte_abandonadas = [
            {
            },
            {
                A: "USUARIO/AGENTE",
                B: "FECHA DE LLAMADA",
                C: "HORA DE LLAMADA",
                D: "HORA DE FIN",
                E: "TMO",
                F: "ESTADO DE LLAMADA",
                G: "NUMERO DE CEDULA",
                H: "APELLIDO Y NOMBRES",
                I: "CIUDAD",
                J: "TELEFONO DE CONTACTO",
                K: "CELULAR DE CONTACTO",
                L: "CORREO",
                M: "ESTADO DEL CLIENTE",
                N: "MOTIVO DE LLAMADA",
                O: "SUBMOTIVO DE LLAMADA",
                P: "OBSERVACIONES"
            },
        ];
        props.data.forEach((row) => {
            if (String(row[5]) === 'Abandonada') {//para filtrar las llamadas abandonadas que se obtuvieron
                const agente = row[0];
                const fecha = row[1];
                const horaI = row[2];
                const horaF = row[3];
                const tiempo = row[4];
                const estadoLlamada = row[5];
                const identificacion = row[6];
                const nombre_cliente = row[7];
                const ciudad = row[8];
                const telefono = row[9];
                const celular = row[10];
                const correo = row[11];
                const estado_cliente = row[12];
                const motivo_llamada = row[13];
                const submotivo_llamada = row[14];
                const observaciones = row[15];

                table_reporte_abandonadas.push({
                    A: agente,
                    B: fecha,
                    C: horaI,
                    D: horaF,
                    E: tiempo,
                    F: estadoLlamada,
                    G: identificacion,
                    H: nombre_cliente,
                    I: ciudad,
                    J: telefono,
                    K: celular,
                    L: correo,
                    M: estado_cliente,
                    N: motivo_llamada,
                    O: submotivo_llamada,
                    P: observaciones,
                })
            }
        });

        const json_reportes = [...title, ...tableReporteTitle, ...table_reporte_general];
        const json_reportes_detalles = [...table_reporte_detalles_title, ...table_reporte_detalles];
        const json_reportes_abandonadas = [...table_reporte_abandonadas];
        console.log(json_reportes);

        //create a new workbook
        const wb = XLSX.utils.book_new();

        const sheet = XLSX.utils.json_to_sheet(json_reportes, {
            skipHeader: true,
        });
        //creando el siguiente libro
        const sheet2 = XLSX.utils.json_to_sheet(json_reportes_detalles, {
            skipHeader: true,
        });
        const sheet3 = XLSX.utils.json_to_sheet(json_reportes_abandonadas, {
            skipHeader: true,
        });

        XLSX.utils.book_append_sheet(wb, sheet, "REPORTE GERENCIAL");
        XLSX.utils.book_append_sheet(wb, sheet2, "TRX_COOP. "+props.client.slice(11));
        XLSX.utils.book_append_sheet(wb, sheet3, "ABANDONADAS");

        // binary large object
        // Since blobs can store binary data, they can be used to store images or other multimedia files.

        const workbookBlob = workbook2blob(wb);
        const dataInfo = {
            sheet1: {
                titleRange: "E2:H3",
                info_table: {
                    campaña: "E5:F5",
                    campaña_value: "G5:H5",
                    tipoReporte: "E6:F6",
                    tipoReporte_value: "G6:H6",
                    dateI: "E7:F7",
                    dateI_value: "G7:H7",
                    dateF: "E8:F8",
                    dateF_value: "G8:H8"
                },
                tableData: {
                    titlePart1: "D10:G10",
                    titlePart2: "H10",
                    titlePart3: "I10",
                    totalRange: "D10:I" + (String(11 + days_len)),
                    resultRange: "D" + (String(11 + days_len)) + ":I" + (String(11 + days_len)),
                    tableLeft: "D11:D"+(String(10 + days_len)),
                    tableRight:"I11:I"+(String(10 + days_len))                    
                }


            },
            sheet2: {
                titleRange: "F2:I3",
                table: {
                    headers_range: "A5:P5",
                    content_range: "A6:P".concat(String(5 + props.data.length))//TAMAÑO DE LAS LLAMADAS
                }
            },
            sheet3: {
                table: {
                    headers_range: "A2:P2",
                    content_range: "A3:P".concat(String(2 + props.data.length))//TAMAÑO DE LAS LLAMADAS
                }
            }

        };

        return addStyle(workbookBlob, dataInfo);
    };

    const addStyle = (workbookBlob, dataInfo) => {
        return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
            workbook.sheets().forEach((sheet) => {
                sheet.usedRange().style({//ESTILOS GLOBALES
                    fontFamily: "Times New Roman",
                    verticalAlignment: "center",
                    horizontalAlignment: "center",
                    fontSize: 12
                });
                if (workbook.sheet("REPORTE GERENCIAL") === sheet) {//para dar los estilos solo a la tabla REPORTE GERENCIAL

                    //ALTURA DE LAS FILAS
                    sheet.row(1).height(13);
                    sheet.row(2).height(13);
                    sheet.row(3).height(13);
                    sheet.row(4).height(13);
                    sheet.row(5).height(13);
                    sheet.row(6).height(13);
                    sheet.row(7).height(13);
                    sheet.row(8).height(13);
                    sheet.row(9).height(13);
                    sheet.row(10).height(26);

                    //STYLE TITLE TABLE

                    //ANCHURA DE LAS COLUMNAS
                    sheet.column("D").width(19);
                    sheet.column("E").width(19);
                    sheet.column("F").width(19);
                    sheet.column("G").width(19);
                    sheet.column("H").width(19);
                    sheet.column("I").width(19);
                    //DISEÑO A LOS RANGOS DEFINIDOS EN dataInfo
                    sheet.range(dataInfo.sheet1.tableData.totalRange).style({
                        border: true
                    });
                    sheet.range(dataInfo.sheet1.tableData.titlePart1).style({
                        fill: "2f74b5",
                        topBorder: "medium"
                    });
                    sheet.cell(dataInfo.sheet1.tableData.titlePart2).style({
                        fill: "7b7b7b",
                        topBorder: "medium"
                    });
                    sheet.cell(dataInfo.sheet1.tableData.titlePart3).style({
                        fill: "a9d08e",
                        fontColor: "ffffff",
                        topBorder: "medium"
                    });
                    /* sheet.cell(dataInfo.sheet1.tableData.tableLeft).style({
                        leftBorder: "medium"
                    });
                    sheet.cell(dataInfo.sheet1.tableData.tableRight).style({
                        rightBorder: "medium"
                    });
                    sheet.cell(dataInfo.sheet1.tableData.resultRange).style({
                        bottomBorder: "medium"
                    });
 */
                    sheet.range(dataInfo.sheet1.tableData.resultRange).style({
                        italic: true,
                    });

                    sheet.range(dataInfo.sheet1.titleRange).merged(true).style({
                        bold: true,
                        horizontalAlignment: "center",
                        verticalAlignment: "center",
                        fill: "5b9bd5",
                        fontColor: "ffffff",
                        border: true

                    });
                    sheet.range(dataInfo.sheet1.info_table.campaña).merged(true).style({
                        bold: true,
                        horizontalAlignment: "center",
                        verticalAlignment: "center",
                        fontColor: "ffffff",
                        fill: "5b9bd5",
                        border: true
                    });
                    sheet.range(dataInfo.sheet1.info_table.tipoReporte).merged(true).style({
                        horizontalAlignment: "center",
                        verticalAlignment: "center",
                        fontColor: "ffffff",
                        fill: "5b9bd5",
                        border: true,
                        bold: true
                    });
                    sheet.range(dataInfo.sheet1.info_table.dateI).merged(true).style({
                        horizontalAlignment: "center",
                        verticalAlignment: "center",
                        fontColor: "ffffff",
                        fill: "5b9bd5",
                        border: true,
                        bold: true
                    });
                    sheet.range(dataInfo.sheet1.info_table.dateF).merged(true).style({
                        horizontalAlignment: "center",
                        verticalAlignment: "center",
                        fontColor: "ffffff",
                        fill: "5b9bd5",
                        border: true,
                        bold: true
                    });
                    sheet.range(dataInfo.sheet1.info_table.campaña_value).merged(true).style({
                        horizontalAlignment: "center",
                        verticalAlignment: "center",
                        fill: "ffffff",
                        /*  fontColor: "24BBEC", */
                        border: true
                    });
                    sheet.range(dataInfo.sheet1.info_table.tipoReporte_value).merged(true).style({
                        horizontalAlignment: "center",
                        verticalAlignment: "center",
                        fill: "ffffff",
                        /*  fontColor: "24BBEC", */
                        border: true
                    });
                    sheet.range(dataInfo.sheet1.info_table.dateI_value).merged(true).style({
                        horizontalAlignment: "center",
                        verticalAlignment: "center",
                        fill: "ffffff",
                        /*  fontColor: "24BBEC", */
                        border: true
                    });
                    sheet.range(dataInfo.sheet1.info_table.dateF_value).merged(true).style({
                        horizontalAlignment: "center",
                        verticalAlignment: "center",
                        fill: "ffffff",
                        /*  fontColor: "24BBEC", */
                        border: true
                    });
                } else if (workbook.sheet("TRX_COOP. "+props.client.slice(11)) === sheet) {//estilos si la hoja se llamada TRX_COOP. DAQUILEMA
                    const alfabeto = ("abcdefghijklmnopqrstuvwxyz").toUpperCase().split("");
                    //const alfabeto = toUpperCase("abcdefghi").split("");
                    props.data.forEach((llamada, i) => {
                        //ALTURA DE LAS FILAS
                        sheet.row(i + 1).height(13);
                    })
                    const numTitles = [...Array(14).keys()];

                    numTitles.forEach((i) => {
                        //ANCHURA DE LAS COLUMNAS
                        sheet.column(String(alfabeto[i])).width(15);
                    })
                    //DISEÑO A LOS RANGOS DEFINIDOS EN dataInfo
                    sheet.range(dataInfo.sheet2.titleRange).merged(true).style({
                        bold: true,
                        horizontalAlignment: "center",
                        verticalAlignment: "center",
                        fill: "92d050",
                        fontColor: "000000",
                        fontFamily: "consolas",
                        border: true
                    });
                    sheet.range(dataInfo.sheet2.table.headers_range).style({
                        bold: true,
                        horizontalAlignment: "center",
                        verticalAlignment: "center",
                        fill: "92d050",
                        fontColor: "000000",
                        border: true,
                        fontFamily: "consolas",
                        fontSize: "8"
                    });
                    sheet.range(dataInfo.sheet2.table.content_range).style({
                        horizontalAlignment: "center",
                        verticalAlignment: "center",
                        border: true,
                        fontFamily: "consolas",
                        fontSize: "8"
                    });
                    sheet.column('H').width(30)
                    sheet.column('N').width(20)
                    sheet.column('O').width(30)
                    sheet.column('P').width(90)
                    sheet.column('P').style({
                        fontSize: "7"
                    })
                } else if (workbook.sheet("ABANDONADAS") === sheet) {//estilos si la hoja se llamada ABANDONADAS
                    const alfabeto = ("abcdefghijklmnopqrstuvwxyz").toUpperCase().split("");
                    //const alfabeto = toUpperCase("abcdefghi").split("");
                    props.data.forEach((llamada, i) => {
                        //ALTURA DE LAS FILAS
                        sheet.row(i + 1).height(13);
                    })
                    const numTitles = [...Array(14).keys()];

                    numTitles.forEach((i) => {
                        //ANCHURA DE LAS COLUMNAS
                        sheet.column(String(alfabeto[i])).width(15);
                    })
                    sheet.range(dataInfo.sheet3.table.headers_range).style({
                        bold: true,
                        horizontalAlignment: "center",
                        verticalAlignment: "center",
                        fill: "92d050",
                        fontColor: "000000",
                        border: true,
                        fontFamily: "consolas",
                        fontSize: "8"
                    });
                    sheet.range(dataInfo.sheet3.table.content_range).style({
                        horizontalAlignment: "center",
                        verticalAlignment: "center",
                        border: true,
                        fontFamily: "consolas",
                        fontSize: "8"
                    });
                    sheet.column('H').width(30)
                    sheet.column('N').width(20)
                    sheet.column('O').width(30)
                    sheet.column('P').width(90)
                    sheet.column('P').style({
                        fontSize: "7"
                    })
                }

            });

            return workbook
                .outputAsync()
                .then((workbookBlob) => URL.createObjectURL(workbookBlob));
        });
    };

    return (

        <div className="excelExportHelper__container">
            <button
                onClick={() => {
                    createDownLoadData();
                }}
                className="toExcel__btn"
            >
                Descargar Reporte
            </button>
        </div>
    );
};

export default ExcelExport2;