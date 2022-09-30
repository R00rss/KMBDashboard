import { maxHeight } from '@mui/system';
import React, { useEffect, useState } from 'react';
import "./SelectedCooperativa.css"
const SelectedCooperativa = ({ logoname = "", styles = { maxHeight: "100px" }, onclick = ()=>{return null}}) => {
  const availableLogos = new Array("mushuc runa", "ccca", "cacpe gualaquiza", "daquilema", "gañansol", "oscus", "patutan", "san francisco", "tena", "tulcan")
  const [selectedLogo, setSelectedlogo] = useState("")
  useEffect(() => {
    if (typeof (logoname) === "string") {
      setSelectedlogo(logoname.replace('COOPERATIVA ', ''));
    }
  }, [logoname])

  return (
    <div onClick={onclick} className='SelectedCooperativa__container'>
      {availableLogos.includes(selectedLogo.toLowerCase()) ?
        <>
          {console.log(styles)}
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

export default SelectedCooperativa