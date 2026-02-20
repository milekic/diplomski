//izdvajanje detalja za odabrani dogadjaj. Kad se na mapi klikne neki dogadjaj, prikazuju se ovi podaci

export function buildSelectedEventDetails(
  feature,
  lonLat,
  areaNameById = {},
  eventTypeNameById = {},
  eventTypeUnitById = {}
) {
  const areaId = Number(feature.get("areaId"));
  const eventTypeId = Number(feature.get("eventTypeId"));

  return {
    areaId,
    areaName: areaNameById?.[areaId] ?? "-",
    eventTypeId,
    eventTypeName: eventTypeNameById?.[eventTypeId] ?? "-",
    eventTypeUnit: eventTypeUnitById?.[eventTypeId] ?? "",
    value: feature.get("value"),
    measuredAtUtc: feature.get("measuredAtUtc"),
    x: lonLat?.[0],
    y: lonLat?.[1],
  };
}
