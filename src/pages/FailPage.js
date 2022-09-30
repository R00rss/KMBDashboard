import React, { useEffect } from 'react'
import "./FailPage.css"
import { useNavigate } from 'react-router-dom'
const FailPage = () => {
    const navigate = useNavigate();
    const goToLogin = (e) => {
        sessionStorage.clear();
        navigate("/")
    }
    useEffect(() => {
        document.getElementById("title__page").innerHTML = "KMB | Not found"
    }, [])

    return (
        <div className='fail__container'>
            <h1>404</h1>
            <p>Error, no se puede acceder a la pagina</p>
            <div className='btn__container'>
                <button onClick={(e) => (goToLogin(e))} className="button__login">Click para ir a la pagina de inicio</button>
            </div>
        </div>
    )
}

export default FailPage