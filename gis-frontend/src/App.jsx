import { useEffect } from "react";
import AppRouter from "./app/AppRouter";
import { createMonitoringConnection } from "./shared/realtime/monitoringConnection";
import "./App.css";

export default function App() {

  return <AppRouter />;
}
