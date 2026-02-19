import { useEffect } from "react";
import AppRouter from "./app/AppRouter";
import { createMonitoringConnection } from "./shared/realtime/monitoringConnection";
import "./App.css";

export default function App() {

  useEffect(() => {
    const connection = createMonitoringConnection();

    // Kada backend pošalje poruku
    connection.on("MeasurementUpdated", (payload) => {
      console.log("📡 MeasurementUpdated:", payload);
    });

    // Pokreni konekciju
    connection.start()
      .then(() => {
        console.log("✅ SignalR connected");
      })
      .catch((err) => {
        console.error("❌ SignalR connection error:", err);
      });

    // Cleanup kada se komponenta unmount-uje
    return () => {
      connection.stop();
    };
  }, []);

  return <AppRouter />;
}
