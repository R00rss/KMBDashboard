import React, { useState } from 'react'
import { useEffect } from 'react'
import logo1 from "../img/logos/kmb2.png"
import "./CreateUser.css"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import FailPage from './FailPage'

const EditUser = () => {
    const estadosDisponibles = ["Super Administrador", "Administrador", "Cliente"]
    //datos del backend
    const [usuariosInfo, setUsuariosInfo] = useState({})
    const [cooperativas, setCooperativas] = useState([])
    const [usuarios, setUsuarios] = useState([])

    //datos del formulario
    const [selectedUser, setSelectedUser] = useState("")//combo box
    const [user, setUser] = useState("")//text
    const [password, setPassword] = useState("")
    const [confpassword, setConfPassword] = useState("")
    const [selectedCooperativa, setSelectedCooperativa] = useState("")
    const [status, setStatus] = useState("")


    const statusUser = parseInt(sessionStorage.getItem("Status"))
    const MySwal = withReactContent(Swal)
    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
    const converStateToNumber = (state) => {
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
    const converStateToString = (state) => {
        switch (state) {
            case 1:
                return estadosDisponibles[0]
            case 2:
                return estadosDisponibles[1]
            case 3:
                return estadosDisponibles[2]
            default:
                return estadosDisponibles[0]
        }
    }
    const getUsers = (data) => {
        const users = []
        for (const key in data) {
            users.push(data[key].usuario)
        }
        return users
    }
    const getDataSelectedUser = (user, data) => {
        for (const key in data) {
            if (data[key]['usuario'] === user) {
                return { "status": parseInt(data[key]['status']), "clientUser": data[key]['clientUser'] }
            }
        }
    }
    useEffect(() => {
        fetch("/api/cooperativas")
            .then(resp => {
                if (resp.status === 200) return (resp.json())
                else alert("Error", resp.status)
            }).then(data => {
                setCooperativas(data)
            });// eslint-disable-next-line
    }, [])
    useEffect(() => {
        fetch("/api/usuarios")
            .then(resp => {
                if (resp.status === 200) return (resp.json())
                else alert("Error", resp.status)
            }).then(data => {
                setUsuariosInfo(data)
                setSelectedUser(Object.values(data)[0]["usuario"])
            });// eslint-disable-next-line
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            fetch("/api/usuarios")
                .then(resp => {
                    if (resp.status === 200) return (resp.json())
                    else alert("Error", resp.status)
                }).then(data => {
                    setUsuariosInfo(data)
                    console.log(data)
                });
        }, 5000);
        return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        if (!isEmpty(usuariosInfo)) {
            setUsuarios(getUsers(usuariosInfo))
            //setSelectedUser(usuarios[0])
        }
    }, [usuariosInfo])


    useEffect(() => {
        if (selectedUser !== undefined && !isEmpty(usuariosInfo)) {
            setUser(selectedUser)
            setStatus(converStateToString(getDataSelectedUser(selectedUser, usuariosInfo).status))
            setSelectedCooperativa(getDataSelectedUser(selectedUser, usuariosInfo).clientUser)
        }
    }, [selectedUser])


    useEffect(() => {
        console.log("selected user: ", selectedUser)
    }, [selectedUser])
    useEffect(() => {
        console.log("usuarios: ", usuarios)
    }, [usuarios])

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
                status: converStateToNumber(status)
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
                confirmButtonText: 'Actualizar',
                denyButtonText: `No actualizar`,
            }).then((result) => {
                if (result.isConfirmed) {
                    //Swal.fire('Saved!', '', 'success')
                    fetch("/api/updateUser", {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    }).then(resp => {
                        if (resp.status === 201) {
                            MySwal.fire({
                                icon: 'success',
                                title: '¡Exito!',
                                text: '¡El usuario ha sido actualizado correctamente!'
                            }).then(
                                () => {
                                    setUser("")
                                    setPassword("")
                                    setConfPassword("")
                                    console.log(body)
                                }
                            )

                        }
                        else if (resp.status === 408) {
                            MySwal.fire({
                                icon: 'warning',
                                title: '¡Alerta!',
                                text: '¡El usuario ingresado no se encuntra en la base!'
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
                    Swal.fire('El usuario no fue actualizado', '', 'info')
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
                                    <h1 className="createUser__form__title"><strong>Editar Usuario</strong></h1>
                                </div>
                                <div className="createUser__form__body">
                                    <div className="createUser__form__field">
                                        <label htmlFor="user"><strong> Usuario:</strong></label>
                                        <select
                                            name='user'
                                            onChange={(e) => setSelectedUser(e.target.value)}
                                            value={selectedUser}
                                        >
                                            
                                            <option defaultValue>{usuarios.length>0?usuarios[0]:["cargando..."]}</option>
                                            {usuarios.map((user, key) => {
                                                if (key === 0) {
                                                    return null
                                                }
                                                return <option key={key}>{user}</option>
                                            })}
                                        </select>
                                    </div>
                                    <div className="createUser__form__field">
                                        <label htmlFor="user"><strong>Nombre de usuario: </strong></label>
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
                                                <label><strong>Seleccione un cliente:</strong></label>
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
                                        <button onClick={(e) => handleClick(e)} className='button__login'>Actualizar</button>
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

export default EditUser