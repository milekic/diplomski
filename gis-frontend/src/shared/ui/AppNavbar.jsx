import { Link, NavLink } from "react-router-dom";

export default function AppNavbar({ userLabel = "Korisnik", onLogout }) {
  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? "active fw-semibold" : ""}`;

  return (
    <nav className="navbar bg-light border-bottom" data-bs-theme="light">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand fw-semibold" to="/userDashboard">
          GIS sistem
        </Link>

        {/* Links */}
        <ul className="navbar-nav flex-row gap-2">
          <li className="nav-item">
            <NavLink to="/userDashboard" end className={linkClass}>
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/areas" className={linkClass}>
              Oblasti
            </NavLink>
          </li>
        </ul>

        {/* Right side */}
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted small">{userLabel}</span>
          <button className="btn btn-outline-secondary btn-sm" onClick={onLogout} type="button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
