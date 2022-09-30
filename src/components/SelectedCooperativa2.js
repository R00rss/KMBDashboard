import React, { useEffect, useState } from 'react';
import "./SelectedCooperativa.css"
const SelectedCooperativa2 = ({ logoname = "", styles = { maxHeight: "100px" }, onclick = () => { return null } }) => {
  const availableLogos = new Array("mushuc runa", "ccca", "cacpe gualaquiza", "daquilema", "gañansol", "oscus", "patutan", "san francisco", "tena", "tulcan", "sanfran", "mushuc", "cacpeg", "ganasol")
  const [selectedLogo, setSelectedlogo] = useState("")
  useEffect(() => {
    if (typeof (logoname) === "string") { setSelectedlogo(logoname.replace("COOP_", "")); }
  }, [logoname])
  useEffect(() => console.log(selectedLogo), [selectedLogo])
  return (
    <div onClick={onclick} className='SelectedCooperativa__container'>
      {availableLogos.includes(selectedLogo.toLowerCase()) ?
        <>
          <img
            style={styles}
            src={require("../img/logos/" + selectedLogo.toLowerCase() + ".png")}
            alt={"logo " + selectedLogo.toLowerCase()}
          />
        </>
        :
        <>{
          console.log("logo seleccionado:", selectedLogo.toLowerCase())
        }
        </>
      }
    </div>
  )
}

export default SelectedCooperativa2