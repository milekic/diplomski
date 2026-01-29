import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserDashboardPage from "../pages/UserDashboardPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Početna ruta -> preusmjeri na login */}
        <Route path="/" element={<Navigate to="/login" replace />} />


        <Route path="/login" element={<LoginPage/>}/>
         <Route path="/register" element={<RegisterPage />} />

       
        <Route path="/userDashboard" element={<UserDashboardPage />} />
        <Route path="/adminDashboard" element={<AdminDashboardPage />} />


        {/* Ako korisnik ukuca nepostojeću rutu */}
        <Route path="*" element={<div className="p-4">Stranica ne postoji</div>} />
      </Routes>
    </BrowserRouter>
  );
}
