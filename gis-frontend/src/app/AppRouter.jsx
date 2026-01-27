import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserDashboardPage from "../pages/UserDashboardPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Početna ruta -> preusmjeri na dashboard */}
        <Route path="/" element={<Navigate to="/userDashboard" replace />} />

        {/* User stranica */}
        <Route path="/userDashboard" element={<UserDashboardPage />} />
        {/*AdminDashboar stranica */}
        <Route path="/adminDashboard" element={<AdminDashboardPage />} />


        {/* Ako korisnik ukuca nepostojeću rutu */}
        <Route path="*" element={<div className="p-4">Stranica ne postoji</div>} />
      </Routes>
    </BrowserRouter>
  );
}
