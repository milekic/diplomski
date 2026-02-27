import { Link, NavLink } from "react-router-dom";
import "./AppNavbar.css";

export default function AppNavbar({ userLabel, role, onLogout }) {

  //ruta koja je aktivna - plava boja
  const linkClass = ({ isActive }) =>
    `nav-link px-3 ${isActive ? "active fw-semibold text-primary" : "text-dark"}`;


  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm py-2 app-navbar">
      <div className="container-fluid">

        {/* ===== Left side ===== */}
        <Link className="navbar-brand fw-bold text-primary fs-5" to="/userDashboard">
          GIS sistem
        </Link>



        {/* ===== LINKOVI ===== */}
        <ul className="navbar-nav mx-auto d-flex flex-row gap-3">

          {/*Pocetna strana za USER-a */}
          {role === "USER" && (
          <li className="nav-item">
            <NavLink to="/userDashboard" end className={linkClass}>
              Mapa
            </NavLink>
          </li>
          )}

          {role === "USER" && (
            <li className="nav-item">
              <NavLink to="/areas" className={linkClass}>
                Oblasti
              </NavLink>
            </li>
          )}

         
          {/* Početna za ADMIN-a */}
          {role === "ADMIN" && (
          <li className="nav-item">
            <NavLink to="/adminDashboard" className={linkClass}>
              Početna
            </NavLink>
          </li>
          )}


        </ul>


        {/* ===== Right side ===== */}
        <div className="d-flex align-items-center gap-3">

          <Link to="/myProfile" className="text-secondary small fw-medium text-decoration-none profile-link">
            {userLabel}
          </Link>

          <button
            className="btn btn-outline-danger btn-sm px-3"
            onClick={onLogout}
            type="button"
          >
            Odjavi se
          </button>

        </div>

      </div>
    </nav>
  );
}
