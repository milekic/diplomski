import axios from "axios";

//ovde sa kreira bazni url i automatski se dodaje jwt token na zahtijev
const apiClient = axios.create({
  baseURL: "https://localhost:7007/api", 
  headers: {
    "Content-Type": "application/json"
  }
});

// Dodavanje JWT tokena 
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
