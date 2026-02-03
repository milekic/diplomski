import apiClient from "../../shared/api/apiClient";


//funkcije za login i register, izvucene radi citljivosti koda
export const login = async (data) => {
    const response = await apiClient.post("/Auth/login", data);
    return response.data;
};

export const register = async (data) => {
  const response = await apiClient.post("/Auth/register", data);
  return response.data;
};


