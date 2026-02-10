import apiClient from "../../../shared/api/apiClient";

// Učitaj oblasti trenutnog korisnika
export const getMyAreas = async () => {
  const response = await apiClient.get("/areas/my");
  return response.data;
};


// Soft delete oblasti
export const deleteArea = async (id) => {
  const response = await apiClient.delete(`/areas/${id}`);
  return response.data; 
};

export const createArea = async (payload) => {
  // payload: { name, description, isGlobal, //isMonitored, geomGeoJson }
  const response = await apiClient.post("/areas", payload);
  return response.data;
};