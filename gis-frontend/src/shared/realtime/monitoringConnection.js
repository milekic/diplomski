import * as signalR from "@microsoft/signalr";

export function createMonitoringConnection() {
  const token = localStorage.getItem("token"); 

  return new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7007/hubs/monitoring", {
      accessTokenFactory: () => token || "",
    })
    .withAutomaticReconnect()
    .build();
}
