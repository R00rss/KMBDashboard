import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Reportes2 from "./pages/Reportes2";
import DashboardPage from "./pages/DashboardPage";
import RegresionPage from "./pages/RegresionPage";
import FailPage from "./pages/FailPage";
import Navbar from "./components/Navbar";
import AudioToText from "./pages/AudioToText";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import DeleteUser from "./pages/DeleteUser";
import ManageUsers from "./pages/ManageUsers";
import CrearPlantilla from "./pages/Plantillas/CrearPlantilla";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/reporte" element={<Reportes2 />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/regresion" element={<RegresionPage />} />
      <Route path="/navbar" element={<Navbar />} />
      <Route path="/audioToText" element={<AudioToText />} />
      <Route path="/createUser" element={<CreateUser />} />
      <Route path="/updateUser" element={<EditUser />} />
      <Route path="/deleteUser" element={<DeleteUser />} />
      <Route path="/manageUsers" element={<ManageUsers />} />
      {/* <Route path="/plantillas" element={<CrearPlantilla />} /> */}
      {/* <Route path="/test" element={<HeatMap />} /> */}
      {/* <Route path="/test2" element={<CrearPlantilla />} /> */}
      {/* <Route path="/heatMap" element={<HeatMap />} /> */}
      <Route path="*" element={<FailPage />} />
    </Routes>
  </BrowserRouter>
  // </React.StrictMode>
);
