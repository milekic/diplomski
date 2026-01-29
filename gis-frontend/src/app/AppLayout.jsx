import { Outlet, useNavigate } from "react-router-dom";
import AppNavbar from "../shared/ui/AppNavbar";

//Zajednicki Layout koji obavije straniceHeader-om
//Koristi se u AppRouter 
export default function AppLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: ovdje kasnije treba obrisati token iz localStorage
    // localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0">
      <AppNavbar userLabel="Korisnik" onLogout={handleLogout} />
      <div className="flex-grow-1">
        <Outlet />
      </div>
    </div>
  );
}
