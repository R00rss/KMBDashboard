import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import imgLogo from "../img/isotipo.png";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import SelectedCooperativa from "./SelectedCooperativa";
import { CSSTransition } from "react-transition-group";
import { ReactComponent as CogIcon } from "../img/icons/cog.svg";
import { ReactComponent as ChevronIcon } from "../img/icons/chevron.svg";
import { ReactComponent as ArrowIcon } from "../img/icons/arrow.svg";
import { ReactComponent as MenuIcon } from "../img/icons/menu_icon.svg";
import { ReactComponent as HomeIcon } from "../img/icons/home.svg";
import { ReactComponent as DeleteUserIcon } from "../img/icons/deleteUser.svg";
import { ReactComponent as UserIcon } from "../img/icons/user.svg";
import { ReactComponent as EditUserIcon } from "../img/icons/editUser.svg";

const Navbar = ({ selected = "" }) => {
  const navigate = useNavigate();
  const validate = sessionStorage.getItem("Validate");
  const status = parseInt(sessionStorage.getItem("Status"));
  const client = sessionStorage.getItem("Client");
  const user = sessionStorage.getItem("User");
  console.log("client", client);
  console.log("user", user);
  console.log(typeof client);
  console.log("validate", validate);

  function DropdownMenu() {
    const [activeMenu, setActiveMenu] = useState("main");
    const [menuHeight, setMenuHeight] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
      setMenuHeight(dropdownRef.current?.firstChild.offsetHeight);
    }, []);

    function calcHeight(el) {
      const height = el.offsetHeight;
      setMenuHeight(height);
    }

    function DropdownItem(props) {
      return (
        <>
          {typeof props.onClick === "function" ? (
            <a className="menu-item" onClick={props.onClick}>
              <span className="icon-button">{props.leftIcon}</span>
              {props.children}
              <span className="icon-right">{props.rightIcon}</span>
            </a>
          ) : (
            <a
              className="menu-item"
              onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}
            >
              <span className="icon-button">{props.leftIcon}</span>
              {props.children}
              <span className="icon-right">{props.rightIcon}</span>
            </a>
          )}
        </>
      );
    }

    return (
      <div
        className="dropdown"
        style={{ height: menuHeight }}
        ref={dropdownRef}
      >
        <CSSTransition
          in={activeMenu === "main"}
          timeout={500}
          classNames="menu-primary"
          unmountOnExit
          onEnter={calcHeight}
        >
          <div className="menu">
            <DropdownItem
              leftIcon={
                client !== "" ? (
                  <SelectedCooperativa
                    logoname={client}
                    styles={{ maxHeight: "30px", margin: "0" }}
                    onclick={() => {
                      console.log("se hizo click");
                    }}
                  />
                ) : (
                  <UserIcon />
                )
              }
            >
              {client !== "" ? client : user}
            </DropdownItem>
            <DropdownItem
              leftIcon={<CogIcon />}
              rightIcon={<ChevronIcon />}
              goToMenu="settings"
            >
              Configuración
            </DropdownItem>
            <DropdownItem onClick={(e) => toLogOut(e)} leftIcon={<HomeIcon />}>
              Salir
            </DropdownItem>
          </div>
        </CSSTransition>

        <CSSTransition
          in={activeMenu === "settings"}
          timeout={500}
          classNames="menu-secondary"
          unmountOnExit
          onEnter={calcHeight}
        >
          <div className="menu">
            <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>
              <span>Opciones de usuario</span>
            </DropdownItem>
            <DropdownItem leftIcon={<EditUserIcon />}>
              Editar usuario
            </DropdownItem>
            <DropdownItem leftIcon={<DeleteUserIcon />}>
              Eliminar usuario
            </DropdownItem>
          </div>
        </CSSTransition>
      </div>
    );
  }
  function NavItem(props) {
    const [open, setOpen] = useState(false);
    return (
      <li className="nav-item">
        <a className="icon-button" onClick={() => setOpen(!open)}>
          {props.icon}
        </a>

        {open && props.children}
      </li>
    );
  }
  const toLogOut = (e) => {
    e.preventDefault();
    sessionStorage.clear();
    sessionStorage.setItem("Validate", "false");
    navigate("/");
  };
  const MySwal = withReactContent(Swal);
  const toReporte = (e) => {
    e.preventDefault();
    if (validate !== undefined || validate !== "") {
      if (validate === "true") {
        navigate("/reporte");
      } else {
        MySwal.fire({
          icon: "error",
          title: "No tiene permisos",
          text: "No tiene permisos para ir a este lugar",
        });
      }
    }
  };

  const toDashboard = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };
  const toPlantillas = (e) => {
    e.preventDefault();
    navigate("/plantillas");
  };
  const toRegresion = (e) => {
    e.preventDefault();
    navigate("/regresion");
  };
  const toAudio = (e) => {
    e.preventDefault();
    navigate("/audioToText");
  };
  const toManageUser = (e) => {
    e.preventDefault();
    navigate("/manageUsers");
  };
  return (
    <div className="navbar___container col-12">
      <div className="logo__container col-3">
        <img className="" src={imgLogo} alt="logo_mkb"></img>
      </div>
      {validate === null ? (
        <></>
      ) : validate === "false" ? (
        <div className="btns__container col-9">
          <div className="btn__container">
            <button className="btn__navbar" onClick={(e) => toLogOut(e)}>
              Salir
            </button>
          </div>
        </div>
      ) : validate === "true" ? (
        <div className="btns__container col-9">
          {status === 1 ? (
            <div className="btn__container separator">
              <button
                id={selected === "manageUsers" ? "activate" : ""}
                className="btn__navbar btn__navbar__large"
                onClick={(e) => toManageUser(e)}
              >
                Usuarios
              </button>
            </div>
          ) : (
            <></>
          )}
          {/* {status === 1 || status === 2 ? (
            <div className="btn__container separator">
              <button
                id={selected === "manageUsers" ? "activate" : ""}
                className="btn__navbar btn__navbar__large"
                onClick={(e) => toPlantillas(e)}
              >
                Plantillas
              </button>
            </div>
          ) : (
            <></>
          )} */}
          <div className="btn__container separator">
            <button
              id={selected === "AudioToText" ? "activate" : ""}
              className="btn__navbar btn__navbar__large"
              onClick={(e) => toAudio(e)}
            >
              Audio a Texto
            </button>
          </div>
          <div className="btn__container separator">
            <button
              id={selected === "RegresionPage" ? "activate" : ""}
              className="btn__navbar btn__navbar__large"
              onClick={(e) => toRegresion(e)}
            >
              Regresion Lineal
            </button>
          </div>
          <div className="btn__container separator">
            <button
              id={selected === "DashboardPage" ? "activate" : ""}
              className="btn__navbar"
              onClick={(e) => toDashboard(e)}
            >
              Dashboard
            </button>
          </div>
          <div className="btn__container separator">
            <button
              id={selected === "Reportes" ? "activate" : ""}
              className="btn__navbar"
              onClick={(e) => toReporte(e)}
            >
              Reportes
            </button>
          </div>
          <div className="btn__container ">
            <NavItem icon={<MenuIcon />}>
              <DropdownMenu />
            </NavItem>
          </div>
        </div>
      ) : (
        <div className="btns__container col-9">
          <div className="btn__container">
            <button className="btn__navbar" onClick={(e) => toLogOut(e)}>
              Salir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
