import apiClient from "../../../shared/api/apiClient";

const CANDIDATE_REQUESTS = [
  (areaId) => ({ url: `/measurements/area/${areaId}` }),
  (areaId) => ({ url: `/measurements/by-area/${areaId}` }),
  (areaId) => ({ url: `/measurements`, params: { areaId } }),
  (areaId) => ({ url: `/areas/${areaId}/measurements` }),
  (areaId) => ({ url: `/events/area/${areaId}` }),
  (areaId) => ({ url: `/events`, params: { areaId } }),
];

function toList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export async function loadAreaMeasurements(areaId) {
  const numericAreaId = Number(areaId);
  if (!Number.isFinite(numericAreaId)) return [];

  for (const buildRequest of CANDIDATE_REQUESTS) {
    const { url, params } = buildRequest(numericAreaId);
    try {
      const response = await apiClient.get(url, { params });
      return toList(response.data);
    } catch {
      // Try next known endpoint shape.
    }
  }

  return [];
}
