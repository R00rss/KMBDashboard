import React, { useEffect, useState } from 'react'
import "./SelectPrimary.css"
const SelectPrimary = (props) => {
    const [selectedItem, setSelectedItem] = useState("");//este valor tendra el componente padre al renderizar

    useEffect(() => {
        props.callbackFunction(selectedItem)// eslint-disable-next-line
    }, [selectedItem])
    useEffect(() => {
        setSelectedItem(props.defaultOption)// eslint-disable-next-line
    }, [])

    return (
        <div className="selectPrimary__container">
            <div className="selectPrimary__head">
                {props.title}
            </div>
            <div className="selectPrimary__body">
                <select
                    onChange={(e) => setSelectedItem(e.target.value)}
                    value={selectedItem}
                >
                    <option id='select__option' defaultValue>{props.defaultOption}</option>
                    {(props.data.length > 0) ?
                        props.data.map((content, key) => {
                            if (content === "") {
                                return null
                            } else {

                                return <option id='select__option' key={key}>{content}</option>
                            }
                        })
                        : <option id='select__option'>Cargando...</option>
                    }
                </select>
            </div>
        </div>
    )
}

export default SelectPrimary