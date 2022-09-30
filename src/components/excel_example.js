import React from "react";
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import "./reactToExcel.css"

const ExcelExportHelper = (props) => {
    const example = [
        [
            "Ajativa5",
            "2022-01-06",
            "08:42:55",
            "08:43:37",
            " ",
            "Atendida",
            "1728923929",
            "MUYULEMA TEJADA LISBETH ESTEFANIA",
            "QUITO",
            "022222222",
            "0987622458",
            "",
            "Positivo",
            "CALIDAD DE LLAMADA",
            "LLAMADA DE PRUEBA",
            "LLAMADA DE PRUEBA"
        ],
        [
            "Ajativa5",
            "2022-01-07",
            "08:34:14",
            "08:34:33",
            " ",
            "Atendida",
            "1728923929",
            "MUYULEMA TEJADA LISBETH ESTEFANIA",
            "QUITO",
            "022222222",
            "0987622458",
            "",
            "Positivo",
            "CALIDAD DE LLAMADA",
            "LLAMADA DE PRUEBA",
            "LLAMADA DE PRUEBA"
        ],
        [
            "Baltamirano4",
            "2022-01-11",
            "09:05:47",
            "09:06:42",
            " ",
            "Atendida",
            "1723893838",
            "MERINO SARANGO ESTEFANY GABRIELA",
            "QUITO",
            "022222222",
            "0987140624",
            "",
            "Positivo",
            "CALIDAD DE LLAMADA",
            "LLAMADA DE PRUEBA",
            "Llamada prueba."
        ],
        [
            "Gsimbana1",
            "2022-01-18",
            "15:29:01",
            "15:29:35",
            " ",
            "Atendida",
            "1719890244",
            "CALOPIÑA JANETA EDISON VLADIMIR",
            "AMBATO",
            "022222222",
            "0998965555",
            "",
            "Positivo",
            "CALIDAD DE LLAMADA",
            "LLAMADA DE PRUEBA",
            "Se procede con éxito."
        ],
        [
            "Schacha7",
            "2022-01-18",
            "17:27:38",
            "17:28:52",
            " ",
            "Atendida",
            "0999999999",
            "Sin nombres",
            "No aplica",
            "022222222",
            "0999999999",
            "",
            "Positivo",
            "CALIDAD DE LLAMADA",
            "LLAMADA DE PRUEBA",
            "Realiza la llamada MERINO SARANGO ESTEFANY GABRIELA"
        ],
        [
            "Mpozo1",
            "2022-01-20",
            "08:24:09",
            "08:24:47",
            " ",
            "Atendida",
            "1728923929",
            "MUYULEMA TEJADA LISBETH ESTEFANIA",
            "QUITO",
            "022222222",
            "0987622458",
            "",
            "Positivo",
            "CALIDAD DE LLAMADA",
            "LLAMADA DE PRUEBA",
            "Llamada de prueba"
        ],
        [
            "Jnegrete1",
            "2022-01-24",
            "10:06:12",
            "10:07:12",
            " ",
            "Atendida",
            "1721694030",
            "RONDON JIMENEZ SANDRA DEL PILAR",
            "QUITO",
            "022222222",
            "0998547211",
            "",
            "Positivo",
            "INFORMACION GENERAL",
            "HORARIOS DE ATENCIÓN DE AGENCIAS",
            "Cliente solicita información sobre nuestra agencia."
        ],
        [
            "Baltamirano4",
            "2022-01-25",
            "14:03:41",
            "14:04:14",
            " ",
            "Atendida",
            "0103749560",
            "MENDEZ SIGUENZA JESUS BERNABE",
            "MACAS",
            "022222222",
            "0990286035",
            "",
            "Positivo",
            "INFORMACION GENERAL",
            "INFORMACION GENERAL",
            "Numero de agencia."
        ],
        [
            "Mpozo1",
            "2022-01-27",
            "10:41:32",
            "10:41:57",
            " ",
            "Atendida",
            "1728923929",
            "MUYULEMA TEJADA LISBETH ESTEFANIA",
            "QUITO",
            "022222222",
            "0987622458",
            "",
            "Positivo",
            "CALIDAD DE LLAMADA",
            "LLAMADA DE PRUEBA",
            "Llamada de prueba"
        ],
        [
            "Ajativa5",
            "2022-02-04",
            "13:37:40",
            "13:47:33",
            " ",
            "Atendida",
            "0104749510",
            "CAIVINAGUA CHACHA JORGE MAURICIO",
            "Gualaquiza",
            "",
            "0991841208",
            "",
            "Positivo",
            "VALIDACIÓN DE DATOS",
            "EXITOSO",
            "TERCERA PERSONA APODERADA SE COMUNICA A NOMBRE DEL SOCIO ci: 1401202393 LLANOS RODRIGUEZ DARWIN MARCELO 0012152526030"
        ],
        [
            "Ajativa5",
            "2022-02-04",
            "13:47:40",
            "13:51:50",
            " ",
            "Atendida",
            "0104749510",
            "CAIVINAGUA CHACHA JORGE MAURICIO",
            "Gualaquiza",
            "",
            "0991841208",
            "",
            "Positivo",
            "PROCESOS DE BANCA VIRTUAL",
            "RESETEO DE PREGUNTA SECRETA",
            "ci: 1401202393 LLANOS RODRIGUEZ DARWIN MARCELO 0012152526030"
        ],
        [
            "mviera",
            "2022-02-09",
            "08:52:02",
            "10:27:48",
            " ",
            "Atendida",
            "1722659438",
            "Viera Caillagua Monica Gabriela",
            "Quito",
            "022497386",
            "0981939089",
            "",
            "Positivo",
            "CALIDAD DE LLAMADA",
            "LLAMADA DE PRUEBA",
            "Llamada de prueba #2"
        ],
        [
            "mviera",
            "2022-02-09",
            "09:05:16",
            "09:08:00",
            " ",
            "Atendida",
            "1712897261",
            "Aguilera Morejón Pablo Francisco",
            "Quito",
            "022222222",
            "0995015854",
            "",
            "Positivo",
            "CALIDAD DE LLAMADA",
            "LLAMADA DE PRUEBA",
            "Llamada de prueba"
        ],
        [
            "mviera",
            "2022-02-09",
            "09:08:07",
            "09:11:05",
            " ",
            "Atendida",
            "1723893838",
            "MERINO SARANGO ESTEFANY GABRIELA",
            "Quito",
            "022736396",
            "0987140624",
            "",
            "Positivo",
            "CALIDAD DE LLAMADA",
            "LLAMADA DE PRUEBA",
            "Llamada de prueba"
        ],
        [
            "mviera",
            "2022-02-09",
            "10:26:54",
            "10:27:21",
            " ",
            "Atendida",
            "1722659438",
            "Viera Caillagua Monica Gabriela",
            "Quito",
            "022497386",
            "0981939089",
            "",
            "Positivo",
            "CALIDAD DE LLAMADA",
            "LLAMADA DE PRUEBA",
            "Prueba"
        ],
        [
            "mviera",
            "2022-02-09",
            "11:02:34",
            "11:02:58",
            " ",
            "Atendida",
            "1722659438",
            "Viera Caillagua Monica Gabriela",
            "Quito",
            "022497386",
            "0981939089",
            "",
            "Positivo",
            "CALIDAD DE LLAMADA",
            "LLAMADA CORTADA",
            "Prueba"
        ],
        [
            "Bcuzco1",
            "2022-02-01",
            "09:45:17",
            "09:51:05",
            " ",
            "Atendida",
            "0100766203",
            "ORDOÑEZ ROLDAN WILSON GERARDO",
            "QUITO",
            "020000000",
            "0988314422",
            "",
            "Positivo",
            "INFORMACION GENERAL",
            "INFORMACION DE CONTACTO PARA AGENCIAS",
            "El socio desea comunicarse con la señorita Ruth Sanmartín, se le otorga el número telefónico de la agencia matriz"
        ],
        [
            "Bcuzco1",
            "2022-02-01",
            "11:38:19",
            "11:48:06",
            " ",
            "Atendida",
            "0104357470",
            "CASTRO CARDONA ANDREA JULIANA",
            "QUITO",
            "020000000",
            "0939343428",
            "",
            "Positivo",
            "ESCALAMIENTO",
            "TRANSFERENCIAS",
            "LA SOCIO INDICA QUE LE DEBITARON EL DINERO DE LA TRANSFERENCIA QUE INTENTÓ  REALIZAR  PERO LE REFLEJABA UN ERROR."
        ],
        [
            "Bcuzco1",
            "2022-02-02",
            "12:28:07",
            "12:30:26",
            " ",
            "Atendida",
            "1900242650",
            "VINTIMILLA ORDOÑEZ ROSA AYDA",
            "CUENCA",
            "020000000",
            "0999999999",
            "",
            "Positivo",
            "INFORMACION GENERAL",
            "DEPÓSITO A PLAZO FIJO",
            "SOLICITA INFORMACIÓN  SOBRE UNA PÓLIZA."
        ],
        [
            "Mpozo1",
            "2022-03-04",
            "08:39:58",
            "08:41:06",
            " ",
            "Atendida",
            "1728923929",
            "MUYULEMA TEJADA LISBETH ESTEFANIA",
            "QUITO",
            "023411004",
            "0987622458",
            "",
            "Positivo",
            "CALIDAD DE LLAMADA",
            "LLAMADA DE PRUEBA",
            "Llamada de prueba"
        ],
        [
            "Mpozo1",
            "2022-03-07",
            "08:42:47",
            "08:43:46",
            " ",
            "Atendida",
            "1728923929",
            "MUYULEMA TEJADA LISBETH ESTEFANIA",
            "QUITO",
            "023411004",
            "0987622458",
            "",
            "Positivo",
            "CALIDAD DE LLAMADA",
            "LLAMADA DE PRUEBA",
            "Llamada de prueba"
        ],
        [
            "Mpozo1",
            "2022-03-08",
            "10:37:58",
            "10:38:55",
            " ",
            "Atendida",
            "0999999999",
            "Sin nombres",
            "No aplica",
            "022222222",
            "0999999999",
            "",
            "Positivo",
            "CALIDAD DE LLAMADA",
            "LLAMADAS CON INTERFERENCIA",
            "Llamada con inferencia"
        ],
        [
            "Gsimbana1",
            "2022-03-08",
            "16:05:17",
            "16:10:15",
            " ",
            "Atendida",
            "0999999999",
            "Sin nombres",
            "No aplica",
            "022222222",
            "0999999999",
            "",
            "Positivo",
            "CALIDAD DE LLAMADA",
            "LLAMADA CORTADA",
            "Con éxito."
        ],
        [
            "Mpozo1",
            "2022-03-09",
            "10:55:37",
            "10:58:20",
            " ",
            "Atendida",
            "0302217716",
            "MOLINA BARAHONA ROCIO MAGDALENA",
            "CUENCA",
            "072820908",
            "0961165738",
            "",
            "Positivo",
            "INFORMACION GENERAL",
            "INFORMACION DE CRÉDITOS",
            "Se le direcciona a la agencia  para la entrega del pago del credito"
        ]
    ]

    const data2 = [
        {
            "PAbandono": 0.0,
            "PServicio": 100.0,
            "TAbandonadas": 0,
            "TContestadas": 9,
            "TEntrantes": 9,
            "dias": [
                "2022-01-01",
                "2022-01-02",
                "2022-01-03",
                "2022-01-04",
                "2022-01-05",
                "2022-01-06",
                "2022-01-07",
                "2022-01-08",
                "2022-01-09",
                "2022-01-10",
                "2022-01-11",
                "2022-01-12",
                "2022-01-13",
                "2022-01-14",
                "2022-01-15",
                "2022-01-16",
                "2022-01-17",
                "2022-01-18",
                "2022-01-19",
                "2022-01-20",
                "2022-01-21",
                "2022-01-22",
                "2022-01-23",
                "2022-01-24",
                "2022-01-25",
                "2022-01-26",
                "2022-01-27",
                "2022-01-28",
                "2022-01-29",
                "2022-01-30",
                "2022-01-31"
            ],
            "llamadas_abandonadas": [
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ]
            ],
            "llamadas_atendidas": [
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        1
                    ]
                ],
                [
                    [
                        1
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        1
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        2
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        1
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        1
                    ]
                ],
                [
                    [
                        1
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        1
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ]
            ],
            "llamadas_entrantes": [
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        1
                    ]
                ],
                [
                    [
                        1
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        1
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        2
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        1
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        1
                    ]
                ],
                [
                    [
                        1
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        1
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ],
                [
                    [
                        0
                    ]
                ]
            ],
            "nivel_abandono": [
                "0",
                "0",
                "0",
                "0",
                "0",
                0.0,
                0.0,
                "0",
                "0",
                "0",
                0.0,
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                0.0,
                "0",
                0.0,
                "0",
                "0",
                "0",
                0.0,
                0.0,
                "0",
                0.0,
                "0",
                "0",
                "0",
                "0"
            ],
            "nivel_servicio": [
                "100",
                "100",
                "100",
                "100",
                "100",
                100.0,
                100.0,
                "100",
                "100",
                "100",
                100.0,
                "100",
                "100",
                "100",
                "100",
                "100",
                "100",
                100.0,
                "100",
                100.0,
                "100",
                "100",
                "100",
                100.0,
                100.0,
                "100",
                100.0,
                "100",
                "100",
                "100",
                "100"
            ]
        }

    ]

    const data3 = [
        [
            [
                "QUITO",
                "022222222",
                "0987622458",
                "",
                "Positivo",
                "CALIDAD DE LLAMADA",
                "LLAMADA DE PRUEBA",
                "LLAMADA DE PRUEBA"
            ],
            [
                "QUITO",
                "022222222",
                "0987622458",
                "",
                "Positivo",
                "CALIDAD DE LLAMADA",
                "LLAMADA DE PRUEBA",
                "LLAMADA DE PRUEBA"
            ],
            [
                "QUITO",
                "022222222",
                "0987140624",
                "",
                "Positivo",
                "CALIDAD DE LLAMADA",
                "LLAMADA DE PRUEBA",
                "Llamada prueba."
            ],
            [
                "AMBATO",
                "022222222",
                "0998965555",
                "",
                "Positivo",
                "CALIDAD DE LLAMADA",
                "LLAMADA DE PRUEBA",
                "Se procede con éxito."
            ],
            [
                "No aplica",
                "022222222",
                "0999999999",
                "",
                "Positivo",
                "CALIDAD DE LLAMADA",
                "LLAMADA DE PRUEBA",
                "Realiza la llamada MERINO SARANGO ESTEFANY GABRIELA"
            ],
            [
                "QUITO",
                "022222222",
                "0987622458",
                "",
                "Positivo",
                "CALIDAD DE LLAMADA",
                "LLAMADA DE PRUEBA",
                "Llamada de prueba"
            ],
            [
                "QUITO",
                "022222222",
                "0998547211",
                "",
                "Positivo",
                "INFORMACION GENERAL",
                "HORARIOS DE ATENCIÓN DE AGENCIAS",
                "Cliente solicita información sobre nuestra agencia."
            ],
            [
                "MACAS",
                "022222222",
                "0990286035",
                "",
                "Positivo",
                "INFORMACION GENERAL",
                "INFORMACION GENERAL",
                "Numero de agencia."
            ],
            [
                "QUITO",
                "022222222",
                "0987622458",
                "",
                "Positivo",
                "CALIDAD DE LLAMADA",
                "LLAMADA DE PRUEBA",
                "Llamada de prueba"
            ]
        ]
    ]
    const createDownLoadData = () => {
        handleExport().then((url) => {
            console.log(url);
            const downloadAnchorNode = document.createElement("a");
            downloadAnchorNode.setAttribute("href", url);
            downloadAnchorNode.setAttribute("download", "Reporte_CCK_KMB.xlsx");
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
                G: "CACPEG INBOUND",//DEBE TOMARSE DE LA DATA
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


        data2.forEach((row) => {
            const PAbandono = row.PAbandono;
            const PServicio = row.PServicio;
            const TAbandonadas = row.TAbandonadas;
            const TContestadas = row.TContestadas;
            const TEntrantes = row.TEntrantes;
            const dias = row.dias;
            const llamadas_abandonadas = row.llamadas_abandonadas;
            const llamadas_atendidas = row.llamadas_atendidas;
            const llamadas_entrantes = row.llamadas_entrantes;
            const nivel_abandono = row.nivel_abandono;
            const nivel_servicio = row.nivel_servicio;
            dias.forEach((d, i) => {
                table_reporte_general.push({
                    D: d,
                    E: llamadas_entrantes[i][0][0],
                    F: llamadas_atendidas[i][0][0],
                    G: llamadas_abandonadas[i][0][0],
                    H: String(nivel_servicio[i]).concat("%"),
                    I: String(nivel_abandono[i]).concat("%"),
                });
            })
            table_reporte_general.push({
                D: "Total de reporte:",
                E: TEntrantes,
                F: TContestadas,
                G: TAbandonadas,
                H: String(PServicio).concat("%"),
                I: String(PAbandono).concat("%")
            })
        });
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
        example.forEach((row) => {
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
        /* data3[0].forEach((row) => {
            const ciudad = row[0];
            const telefono = row[1];
            const celular = row[2];
            const correo = row[3];
            const estado_cliente = row[4];
            const motivo_llamada = row[5];
            const submotivo_llamada = row[6];
            const observaciones = row[7];

            table_reporte_detalles.push({
                I: ciudad,
                J: telefono,
                K: celular,
                L: correo,
                M: estado_cliente,
                N: motivo_llamada,
                O: submotivo_llamada,
                P: observaciones,
            })
        }); */
        //PARA CONCATENAR TABLAS
        /* table1 = table1
            .concat([""])
            .concat(table2)
            .concat([""])
            .concat(table3); */

        const json_reportes = [...title, ...tableReporteTitle, ...table_reporte_general];
        const json_reportes_detalles = [...table_reporte_detalles_title, ...table_reporte_detalles];
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

        XLSX.utils.book_append_sheet(wb, sheet, "REPORTE GERENCIAL");
        XLSX.utils.book_append_sheet(wb, sheet2, "TRX_COOP. CACPEG");

        // binary large object
        // Since blobs can store binary data, they can be used to store images or other multimedia files.

        const workbookBlob = workbook2blob(wb);

        var headerIndexes = [];

        json_reportes.forEach((data, index) =>
            (tableReporteTitle["E"] === "CAMPAÑA") ? headerIndexes.push(index) : null
        );

        /* const rows = data2.dias.length; */

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
                }
            },
            sheet2: {
                titleRange: "F2:I3",
                info_table: {}
                ,
                table: {
                    headers_range: "A5:P5",
                    content_range: "A6:P".concat(String(5 + example.length))//TAMAÑO DE LAS LLAMADAS
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
                    //ANCHURA DE LAS COLUMNAS
                    sheet.column("D").width(19);
                    sheet.column("E").width(19);
                    sheet.column("F").width(19);
                    sheet.column("G").width(19);
                    sheet.column("H").width(19);
                    sheet.column("I").width(19);
                    //DISEÑO A LOS RANGOS DEFINIDOS EN dataInfo
                    sheet.range(dataInfo.sheet1.titleRange).merged(true).style({
                        bold: true,
                        horizontalAlignment: "center",
                        verticalAlignment: "center",
                        fill: "24BBEC",
                        fontColor: "ffffff",
                        border: true

                    });
                    sheet.range(dataInfo.sheet1.info_table.campaña).merged(true).style({
                        horizontalAlignment: "center",
                        verticalAlignment: "center",
                        fontColor: "ffffff",
                        fill: "24BBEC",
                        border: true
                    });
                    sheet.range(dataInfo.sheet1.info_table.tipoReporte).merged(true).style({
                        horizontalAlignment: "center",
                        verticalAlignment: "center",
                        fontColor: "ffffff",
                        fill: "24BBEC",
                        border: true
                    });
                    sheet.range(dataInfo.sheet1.info_table.dateI).merged(true).style({
                        horizontalAlignment: "center",
                        verticalAlignment: "center",
                        fontColor: "ffffff",
                        fill: "24BBEC",
                        border: true
                    });
                    sheet.range(dataInfo.sheet1.info_table.dateF).merged(true).style({
                        horizontalAlignment: "center",
                        verticalAlignment: "center",
                        fontColor: "ffffff",
                        fill: "24BBEC",
                        border: true
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
                } else if (workbook.sheet("TRX_COOP. CACPEG") === sheet) {//estilos si la hoja se llamada TRX_COOP. cacpeg
                    const alfabeto = ("abcdefghijklmnopqrstuvwxyz").toUpperCase().split("");
                    //const alfabeto = toUpperCase("abcdefghi").split("");
                    data3[0].forEach((llamada, i) => {
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
                        fill: "24BBEC",
                        fontColor: "ffffff",
                        fontFamily: "consolas",
                        border: true
                    });
                    sheet.range(dataInfo.sheet2.table.headers_range).style({
                        bold: true,
                        horizontalAlignment: "center",
                        verticalAlignment: "center",
                        fill: "24BBEC",
                        fontColor: "ffffff",
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

export default ExcelExportHelper;