// Spaja live i database dogadjaje
import { normalizeEventForPanel } from "./normalizeEventForPanel";

function parseMeasuredAtMs(measuredAtUtc) {
  if (!measuredAtUtc) return null;
  const ms = Date.parse(measuredAtUtc);
  return Number.isFinite(ms) ? ms : null;
}

export function buildPanelMeasurements({
  areaId,
  liveEvents = [],
  databaseEvents = [],
  cutoffMs,
  eventTypeNameById = {},
  eventTypeUnitById = {},
}) {
  if (!Number.isFinite(areaId)) return [];

  const merged = [...databaseEvents, ...liveEvents].map((eventItem) =>
    normalizeEventForPanel(eventItem, areaId)
  );

  const unique = [];
  const seen = new Set();

  for (const item of merged) {
    const measuredMs = parseMeasuredAtMs(item.measuredAtUtc);
    if (Number.isFinite(cutoffMs) && measuredMs != null && measuredMs > cutoffMs) {
      continue;
    }

    const key = `${item.areaId}|${item.eventTypeId}|${item.value}|${item.measuredAtUtc ?? "-"}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }

  return unique
    .map((item, index) => {
      const typeNameFromMeta = eventTypeNameById?.[item.eventTypeId];
      const unitFromMeta = eventTypeUnitById?.[item.eventTypeId] ?? "";

      return {
        id: `${areaId}-${item.eventTypeId}-${item.measuredAtUtc ?? "no-time"}-${index}`,
        areaId,
        eventTypeId: item.eventTypeId,
        eventTypeName: item.backendEventTypeName ?? typeNameFromMeta ?? "-",
        value: item.value,
        unit: item.unit || unitFromMeta,
        measuredAtUtc: item.measuredAtUtc,
        isCritical: Boolean(item.isCritical),
      };
    })
    .sort((a, b) => {
      const timeA = a.measuredAtUtc ? Date.parse(a.measuredAtUtc) : 0;
      const timeB = b.measuredAtUtc ? Date.parse(b.measuredAtUtc) : 0;
      return timeB - timeA;
    });
}
