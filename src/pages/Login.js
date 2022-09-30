import React, { useEffect } from 'react'
import Form from '../components/Form'
import "./Login.css"
import logo1 from "../img/logos/kmb2.png"
//import logo2 from "../img/logo_kmb_blanco.ico"
const Login = () => {
  useEffect(() => {
    { document.getElementById("title__page").innerHTML = "KMB | Login" }
  }, [])
  return (
    <div className='login__container'>
      <div className='img__container'>
        <img src={logo1} alt="kmb_imagen" />
      </div>
      <Form />
    </div>
  )
}

export default Login