import React, { useState } from 'react'
import { useEffect } from 'react'
import logo1 from "../img/logos/kmb2.png"
import "./CreateUser.css"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import FailPage from './FailPage'
const DeleteUser = () => {
    //datos del backend
    const [usuariosInfo, setUsuariosInfo] = useState({})
    const [usuarios, setUsuarios] = useState([])
    const [userInfo, setUserinfo] = useState({})

    //datos del formulario
    const [selectedUser, setSelectedUser] = useState("")

    const statusUser = parseInt(sessionStorage.getItem("Status"))
    const MySwal = withReactContent(Swal)
    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
    const getUsers = (data) => {
        const users = []
        for (const key in data) {
            users.push(data[key].usuario)
        }
        return users
    }
    const getUserInfo = (data, user) => {
        console.log(data)
        console.log(user)
        for (const key in data)
            if (data[key].usuario === user)
                return data[key]
        return null
    }

    const DisplayInfoUser = ({ flag = false }) => {

        return (
            <>
                {flag ?
                    <>true</>
                    :
                    <>false</>
                }
            </>
        )
    }

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
        fetch("/api/usuarios")
            .then(resp => {
                if (resp.status === 200) return (resp.json())
                else alert("Error", resp.status)
            }).then(data => {
                setUsuariosInfo(data)
                setSelectedUser(Object.values(data)[0]["usuario"])
            })
    }, [])


    useEffect(() => {
        if (!isEmpty(usuariosInfo)) {
            console.log("usuarios info", usuariosInfo)
            setUsuarios(getUsers(usuariosInfo))
        }
    }, [usuariosInfo])


    useEffect(() => {
        if (!isEmpty(usuariosInfo) && selectedUser !== "")
            setUserinfo(getUserInfo(usuariosInfo, selectedUser))
    }, [selectedUser])

    useEffect(() => {
        console.log(userInfo)
    }, [userInfo])

    const handleClick = (e) => {
        e.preventDefault()
        if (selectedUser === ""
        ) {
            MySwal.fire({
                icon: 'warning',
                title: '¡Alerta!',
                text: '¡Todos los campos deben estar llenos!'
            })
            return
        } else {
            let body = {
                user: selectedUser
            }
            MySwal.fire({
                icon: 'warning',
                title: '¡Alerta!',
                text: '¿Esta seguro que quiere Eliminar este usuario?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Eliminar',
                denyButtonText: `No eliminar`,
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch("/api/deleteUser", {
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
                                text: '¡El usuario ha sido eliminado correctamente!'
                            }).then(
                                () => {
                                    setSelectedUser("")
                                }
                            )

                        } else {
                            MySwal.fire({
                                icon: 'error',
                                title: 'Error!',
                                text: '¡Error del servidor!'
                            })
                        }
                    }
                    ).catch(error => { console.error("Error al enviar los datos:", error) })

                } else if (result.isDenied) {
                    Swal.fire('No se elimino el usuario', '', 'info')
                }
            })
        }
    }
    return (
        <>
            {statusUser === 1 ?
                <>
                    <div className='createUser__container'>
                        <img src={logo1} alt="kmb_imagen" />
                        <div className='createUser__form__container'>
                            <form className=''>
                                <div className="createUser__form__head">
                                    <h1 className="createUser__form__title"><strong>Eliminiar Usuario</strong></h1>
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
                                    {isEmpty(userInfo) ?
                                        <></>
                                        :
                                        <article className='userInfo'>
                                            {/* <strong>Usuario:</strong>
                                            <p>{userInfo.usuario}</p> */}
                                            <strong>Estatus:</strong>
                                            <p>{userInfo.status}</p>
                                            {userInfo.clientUser !== "" ?
                                                <>
                                                    <strong>Cliente:</strong>
                                                    <p>{userInfo.clientUser}</p>
                                                </> : <></>}
                                        </article>
                                    }
                                    <div className="button__container">
                                        <button onClick={(e) => handleClick(e)} className='button__login'>Eliminar</button>
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

export default DeleteUser