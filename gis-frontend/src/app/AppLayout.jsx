import { Outlet, useNavigate, Navigate, useLocation } from "react-router-dom";
import AppNavbar from "../shared/ui/AppNavbar";

import { routeAccess } from "./routeAccess";
import AppFooter from "../shared/ui/AppFooter";
import { jwtDecode } from "jwt-decode";
import { getUserFromToken, isTokenExpired } from "../features/auth/token";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../features/auth/authSlice";




export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  //dobijanje podataka odnosno stanja pomocu redux selektora
  const { token, role, username, isAuthenticated } = useSelector(
     state => state.auth
  );

  // nisi ulogovan -> login
  if (!isAuthenticated || !token) return <Navigate to="/login" replace />;

  if (isTokenExpired(token)) {
  dispatch(clearAuth());
  return <Navigate to="/login" replace />;
  }

  //  Provjera dozvole za trenutni URL
  const rule = routeAccess.find(r => location.pathname.startsWith(r.prefix));
  if (rule && !rule.roles.includes(role)) {
    // ako nema pravo, vrati ga na dashboard koji odgovara roli
    const fallback = role === "ADMIN" ? "/adminDashboard" : "/userDashboard";
    return <Navigate to={fallback} replace />;
  }

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate("/login");
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0">

      {/*Header */}
      <AppNavbar
        userLabel={username}
        role={role}
        onLogout={handleLogout}
      />

      {/*Glavni sadrzaj */}
      <div className="flex-grow-1">
        <Outlet />
      </div>

      {/*Footer */}
      <AppFooter/>

      
    </div>
  );
}
