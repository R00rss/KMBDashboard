import React from 'react'
import "./Table.css"
const Table = (props) => {/* Tabla dinamica: recibe dos arreglos, headers y content */
    return (
        <table id={props.rotate ? "tableRotate" : ""} className="table__global">
            {(props.headers) ?
                <thead className="thead__global">
                    <tr className='table-rows'>
                        {props.headers.map((name, key) => (<th key={key}>{name}</th>))}
                    </tr>
                </thead>
                : ""}
            <tbody className="tbody__global">
                {props.content.map(
                    (cont, key) => (((key + 1) % (props.headers.length) === 1) ? (<tr key={key}>{
                        props.headers.map((data, k) => (<td key={k}>{props.content[k + key]}</td>))
                    }</tr>) : ("")))}
            </tbody>
        </table>
    )
}

export default Table