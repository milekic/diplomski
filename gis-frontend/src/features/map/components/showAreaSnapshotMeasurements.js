import { buildPanelMeasurements } from "./buildPanelMeasurements";

export async function showAreaSnapshotMeasurements({
  area,
  allEventsRef,
  panelSnapshotTokenRef,
  getDatabaseEventsForArea,
  eventTypeNameByIdRef,
  eventTypeUnitByIdRef,
  onAreaMeasurementsChangeRef,
}) {
  const areaId = Number(area?.id ?? area?.Id);
  if (!Number.isFinite(areaId)) return;

  const snapshotCutoffMs = Date.now();
  const snapshotLiveEvents = allEventsRef.current
    .filter((eventItem) => Number(eventItem.areaId) === areaId)
    .map((eventItem) => ({ ...eventItem }));

  const snapshotToken = ++panelSnapshotTokenRef.current;

  const liveOnlyMeasurements = buildPanelMeasurements({
    areaId,
    liveEvents: snapshotLiveEvents,
    databaseEvents: [],
    cutoffMs: snapshotCutoffMs,
    eventTypeNameById: eventTypeNameByIdRef.current,
    eventTypeUnitById: eventTypeUnitByIdRef.current,
  });
  onAreaMeasurementsChangeRef.current?.(liveOnlyMeasurements);

  const databaseEvents = await getDatabaseEventsForArea(areaId);
  if (snapshotToken !== panelSnapshotTokenRef.current) return;

  const fullSnapshotMeasurements = buildPanelMeasurements({
    areaId,
    liveEvents: snapshotLiveEvents,
    databaseEvents,
    cutoffMs: snapshotCutoffMs,
    eventTypeNameById: eventTypeNameByIdRef.current,
    eventTypeUnitById: eventTypeUnitByIdRef.current,
  });
  onAreaMeasurementsChangeRef.current?.(fullSnapshotMeasurements);
}
