import apiClient from "../../../shared/api/apiClient";

export const getEventTypes = async () => {
  const res = await apiClient.get("/eventtypes");
  return res.data; 
};
