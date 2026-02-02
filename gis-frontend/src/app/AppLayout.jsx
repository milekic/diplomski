import { Outlet, useNavigate, Navigate, useLocation } from "react-router-dom";
import AppNavbar from "../shared/ui/AppNavbar";
import { logout } from "../features/auth/authApi";
import { routeAccess } from "./routeAccess";
import AppFooter from "../shared/ui/AppFooter";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // nisi ulogovan -> login
  if (!token) return <Navigate to="/login" replace />;

  //  Provjera dozvole za trenutni URL
  const rule = routeAccess.find(r => location.pathname.startsWith(r.prefix));
  if (rule && !rule.roles.includes(role)) {
    // ako nema pravo, vrati ga na dashboard koji odgovara roli
    const fallback = role === "ADMIN" ? "/adminDashboard" : "/userDashboard";
    return <Navigate to={fallback} replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0">

      {/*Header */}
      <AppNavbar
        userLabel={role === "ADMIN" ? "Admin" : "Korisnik"}
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
