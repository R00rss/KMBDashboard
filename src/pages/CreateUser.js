import React, { useState } from 'react'
import { useEffect } from 'react'
//import SelectPrimary from '../components/SelectPrimary'
import logo1 from "../img/logos/kmb2.png"
import "./CreateUser.css"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import FailPage from './FailPage'

const CreateUser = () => {
    const estadosDisponibles = ["Super Administrador", "Administrador", "Cliente"]
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const [confpassword, setConfPassword] = useState("")
    const [selectedCooperativa, setSelectedCooperativa] = useState("")
    const [status, setStatus] = useState("Administrador")
    const [cooperativas, setCooperativas] = useState([])
    const statusUser = parseInt(sessionStorage.getItem("Status"))
    const MySwal = withReactContent(Swal)
    const converState = (state) => {
        switch (state) {
            case estadosDisponibles[0]:
                return 1
            case estadosDisponibles[1]:
                return 2
            case estadosDisponibles[2]:
                return 3
            default:
                return -1
        }
    }
    useEffect(() => {
        setSelectedCooperativa("")
        console.log("status:" + converState(status))// eslint-disable-next-line
    }, [status])
    useEffect(() => {
        console.log(cooperativas)// eslint-disable-next-line
    }, [cooperativas])
    useEffect(() => {
        fetch("/api/cooperativas")
            .then(resp => {
                if (resp.status === 200) return (resp.json())
                else alert("Error", resp.status)
            }).then(data => {
                setCooperativas(data)
            });// eslint-disable-next-line
    }, [])
    const handleClick = (e) => {
        e.preventDefault()
        if (user === "" ||
            password === "" ||
            confpassword === ""
        ) {
            MySwal.fire({
                icon: 'warning',
                title: '¡Alerta!',
                text: '¡Todos los campos deben estar llenos!'
            })
            return
        } else if (confpassword !== password) {
            MySwal.fire({
                icon: 'warning',
                title: '¡Alerta!',
                text: '¡Las contraseñas tienen que ser iguales!'
            })
        } else {
            let body = {
                user: user,
                password: password,
                status: converState(status)
            }
            if (status === 'Cliente') {
                if (cooperativas.includes(selectedCooperativa)) {
                    body["clientUser"] = selectedCooperativa
                } else {
                    MySwal.fire({
                        icon: 'warning',
                        title: '¡Alerta!',
                        text: '¡Debe seleccionar una cooperativa!'
                    })
                    return
                }
            }

            MySwal.fire({
                icon: 'warning',
                title: '¡Alerta!',
                text: '¿Esta seguro que quiere crear este usuario?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                denyButtonText: `No Guardar`,
            }).then((result) => {
                if (result.isConfirmed) {
                    //Swal.fire('Saved!', '', 'success')
                    fetch("/api/createUser", {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    }).then(resp => {
                        if (resp.status === 200) {
                            MySwal.fire({
                                icon: 'success',
                                title: '¡Exito!',
                                text: '¡El usuario ha sido creado correctamente!'
                            }).then(
                                () => {
                                    setUser("")
                                    setPassword("")
                                    setConfPassword("")
                                    console.log(body)
                                }
                            )

                        }
                        else if (resp.status === 409) {
                            MySwal.fire({
                                icon: 'warning',
                                title: '¡Alerta!',
                                text: '¡El usuario ingresado ya existe!'
                            })
                        } else if (resp.status === 400) {
                            MySwal.fire({
                                icon: 'error',
                                title: 'Error!',
                                text: '¡Uno de los campos esta mal ingresado'
                            })
                        } else {
                            MySwal.fire({
                                icon: 'error',
                                title: 'Error!',
                                text: '¡Error del servidor!'
                            })
                        }
                        return (resp.json())
                    }
                    ).then(data => {
                        console.log(data)
                    }).catch(error => { console.error("Error al enviar los datos:", error) })

                } else if (result.isDenied) {
                    Swal.fire('Los datos no fueron guardados', '', 'info')
                }
            })
        }
    }
    return (
        <>
            {statusUser === 1 ?
                <>
                    {/* <Navbar selected='CreateUser' /> */}
                    <div className='createUser__container'>
                        <img src={logo1} alt="kmb_imagen" />
                        <div className='createUser__form__container'>
                            <form className=''>
                                <div className="createUser__form__head">
                                    <h1 className="createUser__form__title"><strong>Creación de Usuario</strong></h1>
                                </div>
                                <div className="createUser__form__body">
                                    <div className="createUser__form__field">
                                        <label htmlFor="user"><strong> Nombre de usuario: </strong></label>
                                        <input value={user} onChange={(e) => (setUser(e.target.value))} type="text" placeholder='example@example.com' name='user' className="user" required />
                                    </div>
                                    <div className="createUser__form__field">
                                        <label htmlFor="password"><strong> Contraseña:</strong></label>
                                        <input value={password} onChange={(e) => (setPassword(e.target.value))} type="password" placeholder='***********' name='password' className="createUser__password" required />
                                    </div>
                                    <div className="createUser__form__field">
                                        <label htmlFor="confPassword"><strong> Confirme la contraseña:</strong></label>
                                        <input value={confpassword} onChange={(e) => (setConfPassword(e.target.value))} type="password" placeholder='***********' name='confPassword' className="createUser__conf_password" required />
                                    </div>
                                    <div className="createUser__form__field">
                                        <label><strong>Tipo de usuario:</strong></label>
                                        <select
                                            onChange={(e) => setStatus(e.target.value)}
                                            value={status}
                                        >
                                            <option defaultValue>{estadosDisponibles[0]}</option>
                                            {estadosDisponibles.map((estado, key) => {
                                                if (key === 0) {
                                                    return null
                                                }
                                                return <option key={key}>{estado}</option>
                                            })}
                                        </select>
                                    </div>
                                    {
                                        status === estadosDisponibles[2] ?
                                            <div className='createUser__form__field'>
                                                <label><strong>Cliente:</strong></label>
                                                <select
                                                    onChange={(e) => setSelectedCooperativa(e.target.value)}
                                                    value={selectedCooperativa}
                                                >
                                                    <option defaultValue>{cooperativas[0]}</option>
                                                    {cooperativas.map((cooperativa, key) => {
                                                        if (key === 0) {
                                                            return null
                                                        }
                                                        return <option key={key}>{cooperativa}</option>
                                                    })}
                                                </select>   
                                            </div>

                                            : <></>
                                    }
                                    <div className="button__container">
                                        <button onClick={(e) => handleClick(e)} className='button__login'>Crear</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
                :
                <FailPage />
            }
        </>
    )
}

export default CreateUser