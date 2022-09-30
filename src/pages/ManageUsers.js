import React from 'react'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import CreateUser from './CreateUser'
import DeleteUser from './DeleteUser'
import EditUser from './EditUser'

const ManageUsers = () => {
  const [createUser, setCreateUser] = useState(true)
  const [updateUser, setUpdateUser] = useState(false)
  const [deleteUser, setDeleteUser] = useState(false)

  return (
    <div className='manageUser__container' style={{backgroundColor:"#000000"}}>
      <Navbar selected = "manageUsers"/>
      <div className="dashboard_selectors ">
        <button
          id={createUser ? "activate" : ""}
          onClick={() => {
            setUpdateUser(false)
            setCreateUser(true)
            setDeleteUser(false)
          }}
          className='dashboarpage__btn dashboarpage__btn1'>
          Crear usuario
        </button>
        <button
          id={updateUser ? "activate" : ""}
          onClick={() => {
            setUpdateUser(true)
            setCreateUser(false)
            setDeleteUser(false)
          }}
          className='dashboarpage__btn dashboarpage__btn2 '>
          Editar usuario
        </button>

        <button
          id={deleteUser ? "activate" : ""}
          onClick={() => {
            setUpdateUser(false)
            setCreateUser(false)
            setDeleteUser(true)
          }}
          className='dashboarpage__btn'>
          Eliminar usuario
        </button>

      </div>
      <>
        {createUser ?
          <CreateUser />
          : updateUser ?
            <EditUser />
            : deleteUser ?
              <DeleteUser />
              : <></>
        }
      </>

    </div>
  )
}

export default ManageUsers