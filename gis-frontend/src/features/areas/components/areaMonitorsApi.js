import apiClient from "../../../shared/api/apiClient";

export const getActiveAreaMonitorsByAreaId = async (areaId) => {
  const res = await apiClient.get(`/areamonitors/area/${areaId}`);
  return res.data;
};


export const syncAreaMonitors = async (areaId, selected) => {
  const res = await apiClient.put(`/areamonitors/area/${areaId}/sync`,{selected: selected});
  return res.data;
};