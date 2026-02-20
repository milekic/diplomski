import { getActiveAreaMonitorsByAreaId } from "../../areas/components/areaMonitorsApi";

export async function loadThresholdByAreaAndEvent(areaIds = []) {
  if (!Array.isArray(areaIds) || areaIds.length === 0) {
    return {};
  }

  const rows = await Promise.all(
    areaIds.map(async (areaId) => {
      try {
        const monitors = await getActiveAreaMonitorsByAreaId(areaId);
        return { areaId, monitors: Array.isArray(monitors) ? monitors : [] };
      } catch {
        return { areaId, monitors: [] };
      }
    })
  );

  const next = {};

  for (const row of rows) {
    for (const monitor of row.monitors) {
      const eventTypeId = Number(
        monitor.eventTypeId ?? monitor.EventTypeId
      );
      const threshold = Number(
        monitor.threshold ?? monitor.Threshold
      );

      if (!Number.isFinite(eventTypeId) || !Number.isFinite(threshold)) {
        continue;
      }

      next[`${row.areaId}-${eventTypeId}`] = threshold;
    }
  }

  return next;
}
