import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserDashboardPage from "../pages/UserDashboardPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import OblastiPage from "../pages/OblastiPage";
import AppLayout from "./AppLayout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* početna -> login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* stranice bez navbara */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* stranice SA navbarom */}
        <Route element={<AppLayout />}>
          <Route path="/userDashboard" element={<UserDashboardPage />} />
          <Route path="/adminDashboard" element={<AdminDashboardPage />} />
          <Route path="/areas" element={<OblastiPage />} />
        </Route>

        <Route path="*" element={<div className="p-4">Stranica ne postoji</div>} />
      </Routes>
    </BrowserRouter>
  );
}
