export function toFeatureCollection(geomGeoJson) {
  if (!geomGeoJson) return null;

  try {
    const obj =
      typeof geomGeoJson === "string"
        ? JSON.parse(geomGeoJson)
        : geomGeoJson;

    if (obj?.type === "FeatureCollection" || obj?.type === "Feature") {
      return obj;
    }

    return {
      type: "FeatureCollection",
      features: [{ type: "Feature", geometry: obj, properties: {} }],
    };
  } catch {
    return null;
  }
}
