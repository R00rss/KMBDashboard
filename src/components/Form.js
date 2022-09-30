import React, { useState } from 'react'
import "./Form.css"
import {
  useNavigate
} from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Form = () => {
  const [user, setUser] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal)
  const getVerification = (e) => {
    e.preventDefault()
    if (user === "" || password === "") {
      MySwal.fire({
        icon: 'warning',
        title: '¡Alerta!',
        text: '¡Todos los campos son obligatorios!'
      })
    } else {

      fetch("/api/verification", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user: user,
          password: password
        })
      }).then(resp => {
        if (resp.status === 200) return (resp.json())
        else if (resp.status === 408){
          MySwal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'Usuario o contraseña incorrecta'
          })
        }else{
          console.log(resp.status)
          MySwal.fire({
            icon: 'error',
            title: 'Error',
            text: '¡Error en la respuesta del servidor!'
          })
        }
      }
      ).then(data => {

        if (data.verificacion === undefined) {
          MySwal.fire({
            icon: 'error',
            title: 'Error',
            text: '¡Error en la respuesta del servidor!'
          })
        } else {
          if (data.verificacion) {
            //alert("Se ha logeado correctamente")

            MySwal.fire({
              icon: 'success',
              title: '¡Bienvenido ' + user + '!',
              text: '¡Se ha logeado correctamente!'
            }).then(() => {
              //console.log("ultima promesa")
              sessionStorage.clear();
              sessionStorage.setItem("User", user)
              if ("status" in data) {
                console.log("status", data.status)
                if (data.status !== undefined) {
                  sessionStorage.setItem("Status", data.status)
                  if ("clientUser" in data) {
                    //console.log(data.clientUser)
                    sessionStorage.setItem("Client", data.clientUser)
                  } else {
                    console.log(" no data clientUser")
                  }
                } else {
                  sessionStorage.setItem("Status", -1)
                }
              }
              sessionStorage.setItem("Validate", "true")
              navigate("/reporte")
            })

          } else {
            MySwal.fire({
              icon: 'error',
              title: 'Error',
              text: '¡Usuario o Contraseña equivocados!'
            }).then(() => {
              setPassword("")
              sessionStorage.clear();
              sessionStorage.setItem("Validate", "false")
            })
          }

        }
      }).then(
      ).catch(error => { console.error("Error al enviar los datos:", error) })
    }
  }


  return (
    <div className='form__container'>
      <form className='needs-validation'>
        <div className="form__head">
          <h1 className="form__title">Bienvenido/a</h1>
        </div>
        <div className="form__body">
          <div className="form__field">
            <label htmlFor="user">Usuario</label>
            <input value={user} onChange={(e) => (setUser(e.target.value))} type="email" placeholder='example@example.com' name='user' className="user" required />
          </div>
          <div className="form__field">
            <label htmlFor="password">Contraseña</label>
            <input value={password} onChange={(e) => (setPassword(e.target.value))} type="password" placeholder='***********' name='password' className="form__password" required />
          </div>
          <div className="button__container">
            <button onClick={(e) => getVerification(e)} className='button__login'>Ingresar</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Form