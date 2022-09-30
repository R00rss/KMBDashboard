import { useState } from "react";
import { useEffect } from "react";
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
// import "./reactToExcel.css"


const ExcelVoc = ({ data, file_name, client }) => {
  const nombre_libro = "Reporte VOC " + client
  // const [data, setData] = useState({})
  /* const getEstados = (cooperativa = "all") => {
    const bodyData = { "cooperativa": cooperativa }
    fetch("/api/dashboardVOC", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyData)
    }).then(resp => {
      if (resp.status === 200) return (resp.json())
      else { alert("algo salio mal :(") }
    }
    ).then(data => { setData(data.consulta_VOC) }).catch(error => { console.error("Error al enviar los datos:", error) })
  }
  useEffect(() => getEstados(), []) */

  console.log(data)

  const createDownLoadData = () => {
    handleExport().then((url) => {
      console.log(url);
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", url);
      downloadAnchorNode.setAttribute("download", file_name + ".xlsx");
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
    const title_reporte_VOC = [
      {},//fila en blanco
      {
        A: "",
        B: "",
        C: "",
        D: "REPORTE VOC " + client
      },
      {}//fila en blanco
    ];

    let table_reporte_VOC = [
      {},
      {
        A: "Agente",
        B: "Fecha llamada",
        C: "Hora",
        D: "Estado",
        E: "Calificación",
        F: "Nombre",
        G: "Mensaje"
      },
    ];
    data.forEach((row) => {
      const estado = row[0];
      const calificacion = row[1];
      const mensaje = row[2];
      const fecha = row[3];
      const nombre = row[4];
      // const id_base = row[5];
      const agente = row[6];
      const hora = row[7];

      table_reporte_VOC.push({
        A: agente,
        B: fecha,
        C: hora,
        D: estado,
        E: calificacion,
        F: nombre,
        G: mensaje
      })
    });

    const json_reporte_VOC = [...title_reporte_VOC, ...table_reporte_VOC];
    console.log(json_reporte_VOC);
    //create a new workbook
    const wb = XLSX.utils.book_new();

    const sheet = XLSX.utils.json_to_sheet(json_reporte_VOC, { skipHeader: true });

    XLSX.utils.book_append_sheet(wb, sheet, nombre_libro);

    // binary large object
    // Since blobs can store binary data, they can be used to store images or other multimedia files.
    //RANGO DE LOS ESTILOS
    const workbookBlob = workbook2blob(wb);
    const dataInfo = {
      sheet: {
        titleRange: "D2:F3",
        table: {
          headers_range: "A5:G5",
          content_range: "A6:G".concat(String(5 + data.length))//TAMAÑO DE LAS LLAMADAS
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
        if (workbook.sheet(nombre_libro) === sheet) {//estilos si la hoja se llamada TRX_COOP. DAQUILEMA
          const alfabeto = ("abcdefghijklmnopqrstuvwxyz").toUpperCase().split("");
          //const alfabeto = toUpperCase("abcdefghi").split("");
          data.forEach((item, i) => {
            //ALTURA DE LAS FILAS
            sheet.row(i + 1).height(23);
          })
          const numTitles = [...Array(14).keys()];

          numTitles.forEach((i) => {
            //ANCHURA DE LAS COLUMNAS
            sheet.column(String(alfabeto[i])).width(14);
          })
          //DISEÑO A LOS RANGOS DEFINIDOS EN dataInfo
          sheet.range(dataInfo.sheet.titleRange).merged(true).style({
            bold: true,
            horizontalAlignment: "center",
            verticalAlignment: "center",
            fill: "0eb0cc",
            fontColor: "000000",
            fontFamily: "consolas",
            border: true
          });
          sheet.range(dataInfo.sheet.table.headers_range).style({
            bold: true,
            horizontalAlignment: "center",
            verticalAlignment: "center",
            fill: "0eb0cc",
            fontColor: "000000",
            border: true,
            fontFamily: "consolas",
            fontSize: "8"
          });
          sheet.range(dataInfo.sheet.table.content_range).style({
            horizontalAlignment: "center",
            verticalAlignment: "center",
            border: true,
            fontFamily: "consolas",
            fontSize: "8"
          });
          sheet.column('F').width(30)
          sheet.column('G').width(75)
          sheet.column('G').style({ fontSize: "8" ,horizontalAlignment:"justify",verticalAlignment:"justify" })
          sheet.cell('G5').style({ horizontalAlignment:"center",verticalAlignment:"center" })
        }

      });

      return workbook
        .outputAsync()
        .then((workbookBlob) => URL.createObjectURL(workbookBlob));
    });
  };

  return (
    <div className="excelExportHelper__container" style={{marginTop:"1rem"}}>
      <button className="toExcel__btn" onClick={() => createDownLoadData()} > Descargar VOC </button>
    </div>
  );
};

export default ExcelVoc;