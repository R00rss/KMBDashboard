import React, { useEffect, useState } from "react";
import "./Select.css";
const SelectAgent = () => {
    const [data, setData] = useState("");
    const [agent,setAgent] = useState("");
    const getAgente = () => {
        fetch("/api/agentes")
            .then(resp => {
                if (resp.status === 200) return (resp.json())
                else alert("Error", resp.status)
            }
            ).then(data => {
                setData(data);
                console.log(data)
            });
    };
    useEffect(() => {
        getAgente()
    }, [])
    useEffect(() => {
        console.log("El agente seleccionado es:",agent)
    }, [agent])
    
    //no need to add dependency array
    return (
        <div className="container__selectAgente">
            Seleccione un agente para revisar su eficiencia
            <select className="form-select" aria-label="Default select example"
                onChange={(e) => setAgent(e.target.value)}
            >
                <option defaultValue>Elija un Agente</option>
                {data ?
                    data.map((agent, key) => (
                        <option key={key}>{agent[0]}</option>
                    ))
                    : <option>Sin resultados</option>
                }
            </select>
        </div>
    );

};

export default SelectAgent;
