import apiClient from "../../../shared/api/apiClient";

export const getVisibleAreas = async () => {
  const response = await apiClient.get("/areas/visible");
  return response.data;
};
