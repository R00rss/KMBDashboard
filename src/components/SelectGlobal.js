import React, { useEffect, useState } from 'react'
import "./SelectGlobal2.css"
const SelectGlobal = (props) => {
    const [selectedItem, setSelectedItem] = useState("");
    useEffect(() => {
        fetch(`/api/selected${String(props.sendDataName)}`, {
            method: 'POST',
            body: JSON.stringify({
                data: selectedItem
            })
        }).then((res) => {
            if (res.status === 200) {
                //console.log("subida exitosa de:", selectedItem)
            } else {
                console.log("Error al subir el dato:", selectedItem, " el status es: ", res.status)
            }
        }
        )// eslint-disable-next-line
    }, [selectedItem])

    useEffect(() => {
        setSelectedItem(props.defaultOption)// eslint-disable-next-line
    }, [])
    return (
        <div className="selectGlobal__container">
            <div className="selectGlobal__head">
                {props.title}
            </div>
            <div className="selectGlobal__body">
                <select className="" aria-label=""
                    onChange={(e) => setSelectedItem(e.target.value)}
                    value={selectedItem}
                >
                    <option id='select__option' defaultValue>{props.defaultOption}</option>
                    {(props.data.length > 0) ?
                        props.data.map((content, key) => {
                            if (String(content).length > 1) {
                                return <option id='select__option' key={key}>{content}</option>
                            }
                            return null
                        })
                        :
                        <option id='select__option'>Cargando...</option>
                    }
                </select>
            </div>
        </div>
    )
}

export default SelectGlobal