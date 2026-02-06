import apiClient from "../../../shared/api/apiClient";

// Učitaj oblasti trenutnog korisnika
export const getMyAreas = async () => {
  const response = await apiClient.get("/areas/my");
  return response.data;
};
