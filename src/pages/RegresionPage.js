import React, { useEffect } from 'react'
import Regresion from '../components/Regresion'
import Navbar from '../components/Navbar'
import FailPage from './FailPage'
const RegresionPage = () => {
  const validate = sessionStorage.getItem("Validate")
  const status = parseInt(sessionStorage.getItem("Status"))
  var client = sessionStorage.getItem("Client")
  if (client === "") {
    client = null
  }
  console.log(status)
  useEffect(() => {
    document.getElementById("title__page").innerHTML = "KMB | Regresion"
  }, [])

  return (
    <>
      {validate === 'true' ?
        <div className='regresionPage_container' style={{backgroundColor:"#000000"}}>
          <Navbar selected={"RegresionPage"} />
          <div className="dashboard_selectors">
            <label>
              Regresion Lineal
            </label>
          </div>
          <Regresion client={client} />
        </div>
        :
        <FailPage />
      }
    </>
  )
}

export default RegresionPage