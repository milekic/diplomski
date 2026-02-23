import { useEffect, useMemo, useRef, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { fromLonLat } from "ol/proj";
import { Style, Icon } from "ol/style";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";

import {
  DEFAULT_CENTER_LONLAT,
  DEFAULT_ZOOM,
  GEOJSON_DATA_PROJECTION,
  MAP_VIEW_PROJECTION,
} from "../../../shared/constants/mapConstants";

import { createMonitoringConnection } from "../../../shared/realtime/monitoringConnection";
import EventDetailsModal from "./EventDetailsModal";
import { DEFAULT_ICON_URL } from "./eventIcons";
import { toFeatureCollection } from "./geoJsonUtils";
import { loadThresholdByAreaAndEvent } from "./thresholdUtils";
import { loadAreaMeasurements } from "./areaMeasurementsApi";
import { loadEventTypeMetaById } from "./eventTypeIconUtils";
import { buildSelectedEventDetails } from "./eventSelectionUtils";
import { normalizeMeasuredAtUtc } from "./normalizeEventForPanel";
import { showAreaSnapshotMeasurements } from "./showAreaSnapshotMeasurements";
import useMapInit from "./useMapInit";

function isExpectedNegotiationStop(error) {
  const message = String(error?.message ?? error ?? "").toLowerCase();
  return message.includes("stopped during negotiation");
}

export default function MapView({
  selectedAreas = [],
  eventVisibilityMode = "all",
  onAreaSelect,
  onAreaMeasurementsChange,
}) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const onAreaSelectRef = useRef(onAreaSelect);
  const onAreaMeasurementsChangeRef = useRef(onAreaMeasurementsChange);

  const vectorSourceRef = useRef(new VectorSource());
  const vectorLayerRef = useRef(
    new VectorLayer({
      source: vectorSourceRef.current,
    })
  );

  const eventSourceRef = useRef(new VectorSource());
  const styleCacheRef = useRef({});

  // All events are stored here
  const [allEvents, setAllEvents] = useState([]);
  const allEventsRef = useRef(allEvents);
  const databaseEventsByAreaIdRef = useRef({});
  const panelSnapshotTokenRef = useRef(0);
  const [thresholdByAreaAndEvent, setThresholdByAreaAndEvent] = useState({});

  const [eventTypeIconById, setEventTypeIconById] = useState({});
  const [eventTypeNameById, setEventTypeNameById] = useState({});
  const [eventTypeUnitById, setEventTypeUnitById] = useState({});
  const eventTypeIconByIdRef = useRef(eventTypeIconById);
  const eventTypeNameByIdRef = useRef(eventTypeNameById);
  const eventTypeUnitByIdRef = useRef(eventTypeUnitById);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    eventTypeIconByIdRef.current = eventTypeIconById;
  }, [eventTypeIconById]);

  useEffect(() => {
    allEventsRef.current = allEvents;
  }, [allEvents]);

  useEffect(() => {
    eventTypeNameByIdRef.current = eventTypeNameById;
  }, [eventTypeNameById]);

  useEffect(() => {
    eventTypeUnitByIdRef.current = eventTypeUnitById;
  }, [eventTypeUnitById]);

  const eventLayerRef = useRef(
    new VectorLayer({
      source: eventSourceRef.current,
      style: (feature) => {
        const eventTypeId = Number(feature.get("eventTypeId"));
        const iconUrl = eventTypeIconByIdRef.current?.[eventTypeId] || DEFAULT_ICON_URL;

        if (!styleCacheRef.current[iconUrl]) {
          styleCacheRef.current[iconUrl] = new Style({
            image: new Icon({
              src: iconUrl,
              scale: 0.06,
              anchor: [0.5, 1],
            }),
          });
        }

        return styleCacheRef.current[iconUrl];
      },
    })
  );

  const selectedAreaIdSet = useMemo(() => {
    return new Set(selectedAreas.map((a) => Number(a.id ?? a.Id)).filter(Number.isFinite));
  }, [selectedAreas]);

  const selectedAreaIds = useMemo(() => {
    return [...selectedAreaIdSet];
  }, [selectedAreaIdSet]);

  const areaNameById = useMemo(() => {
    const map = {};
    for (const a of selectedAreas) {
      const id = Number(a.id ?? a.Id);
      if (!Number.isFinite(id)) continue;
      map[id] = a.name ?? a.Name ?? "-";
    }
    return map;
  }, [selectedAreas]);

  const selectedAreaById = useMemo(() => {
    const map = {};
    for (const area of selectedAreas) {
      const id = Number(area.id ?? area.Id);
      if (!Number.isFinite(id)) continue;
      map[id] = area;
    }
    return map;
  }, [selectedAreas]);

  const areaNameByIdRef = useRef(areaNameById);
  const selectedAreaByIdRef = useRef(selectedAreaById);

  useEffect(() => {
    areaNameByIdRef.current = areaNameById;
  }, [areaNameById]);

  useEffect(() => {
    selectedAreaByIdRef.current = selectedAreaById;
  }, [selectedAreaById]);

  useEffect(() => {
    onAreaSelectRef.current = onAreaSelect;
  }, [onAreaSelect]);

  useEffect(() => {
    onAreaMeasurementsChangeRef.current = onAreaMeasurementsChange;
  }, [onAreaMeasurementsChange]);

  const getDatabaseEventsForArea = async (areaId) => {
    if (Object.prototype.hasOwnProperty.call(databaseEventsByAreaIdRef.current, areaId)) {
      return databaseEventsByAreaIdRef.current[areaId];
    }

    const rows = await loadAreaMeasurements(areaId);
    const normalizedRows = Array.isArray(rows) ? rows : [];
    databaseEventsByAreaIdRef.current[areaId] = normalizedRows;
    return normalizedRows;
  };

  //map init
  useMapInit({
    mapRef,
    mapDivRef,
    vectorLayer: vectorLayerRef.current,
    eventLayer: eventLayerRef.current,
    centerLonLat: DEFAULT_CENTER_LONLAT,
    zoom: DEFAULT_ZOOM,
    selectedAreaByIdRef,
    onEventFeatureClick: (feature, lonLat) => {
      setSelectedEvent(
        buildSelectedEventDetails(
          feature,
          lonLat,
          areaNameByIdRef.current,
          eventTypeNameByIdRef.current,
          eventTypeUnitByIdRef.current
        )
      );
      setIsModalOpen(true);
    },
    onAreaFeatureClick: (clickedArea) => {
      onAreaSelectRef.current?.(clickedArea);
      showAreaSnapshotMeasurements({
        area: clickedArea,
        allEventsRef,
        panelSnapshotTokenRef,
        getDatabaseEventsForArea,
        eventTypeNameByIdRef,
        eventTypeUnitByIdRef,
        onAreaMeasurementsChangeRef,
      });
    },
  });

  // ===== LOAD EVENT TYPES =====
  useEffect(() => {
    let cancelled = false;

    const loadIcons = async () => {
      const { iconById, nameById, unitById } = await loadEventTypeMetaById();
      if (cancelled) return;
      setEventTypeIconById(iconById);
      setEventTypeNameById(nameById);
      setEventTypeUnitById(unitById);
      eventLayerRef.current?.changed();
    };

    loadIcons();

    return () => {
      cancelled = true;
    };
  }, []);

  // ===== UPDATE POLYGONS =====
  useEffect(() => {
    const source = vectorSourceRef.current;
    source.clear();

    const format = new GeoJSON({
      dataProjection: GEOJSON_DATA_PROJECTION,
      featureProjection: MAP_VIEW_PROJECTION,
    });

    selectedAreas.forEach((a) => {
      const geo = a.geomGeoJson ?? a.GeomGeoJson;
      const fc = toFeatureCollection(geo);
      if (!fc) return;

      const features = format.readFeatures(fc);
      features.forEach((f) => f.set("areaId", a.id ?? a.Id));
      source.addFeatures(features);
    });
  }, [selectedAreas]);

  // ===== LOAD THRESHOLDS FOR SELECTED AREAS =====
  useEffect(() => {
    let cancelled = false;

    const loadThresholds = async () => {
      const next = await loadThresholdByAreaAndEvent(selectedAreaIds);
      if (cancelled) return;
      setThresholdByAreaAndEvent(next);
    };

    loadThresholds();

    return () => {
      cancelled = true;
    };
  }, [selectedAreaIds]);

  // Filter events by checked areas and critical mode
  useEffect(() => {
    const source = eventSourceRef.current;
    source.clear();

    const isCritical = (e) => {
      const value = Number(e.value);
      if (!Number.isFinite(value)) return false;

      const threshold = thresholdByAreaAndEvent[`${e.areaId}-${e.eventTypeId}`];
      if (!Number.isFinite(threshold)) return false;

      return value > threshold;
    };

    allEvents
      .filter((e) => selectedAreaIdSet.has(e.areaId))
      .filter((e) => (eventVisibilityMode === "criticalOnly" ? isCritical(e) : true))
      .forEach((e) => {
        const point = new Point(fromLonLat([Number(e.x), Number(e.y)]));

        const feature = new Feature({ geometry: point });

        feature.set("areaId", e.areaId);
        feature.set("eventTypeId", e.eventTypeId);
        feature.set("value", e.value);
        feature.set("measuredAtUtc", e.measuredAtUtc);

        source.addFeature(feature);
      });
  }, [allEvents, eventVisibilityMode, selectedAreaIdSet, thresholdByAreaAndEvent]);

  // ===== SIGNALR =====
  useEffect(() => {
    const connection = createMonitoringConnection();
    let disposed = false;

    const onMeasurementUpdated = (payload) => {
      const areaId = Number(payload.areaId ?? payload.AreaId);

      const x = payload.x ?? payload.X;
      const y = payload.y ?? payload.Y;
      if (x == null || y == null) return;

      const eventTypeId = Number(payload.eventTypeId ?? payload.EventTypeId);

      setAllEvents((prev) => [
        ...prev,
        {
          areaId,
          eventTypeId,
          value: payload.value ?? payload.Value,
          measuredAtUtc: normalizeMeasuredAtUtc(
            payload.measuredAtUtc ??
              payload.MeasuredAtUtc ??
              payload.measuredAt ??
              payload.MeasuredAt ??
              payload.measurementTimeUtc ??
              payload.MeasurementTimeUtc ??
              payload.timestamp ??
              payload.Timestamp
          ),
          x: Number(x),
          y: Number(y),
        },
      ]);
    };

    connection.on("MeasurementUpdated", onMeasurementUpdated);

    const startPromise = connection.start().catch((error) => {
      if (disposed && isExpectedNegotiationStop(error)) return;
      console.error("SignalR error", error);
    });

    return () => {
      disposed = true;
      connection.off("MeasurementUpdated", onMeasurementUpdated);

      Promise.resolve(startPromise).finally(() => {
        connection.stop().catch(() => {});
      });
    };
  }, []);

  return (
    <>
      <div ref={mapDivRef} style={{ width: "100%", height: "100%" }} />

      <EventDetailsModal show={isModalOpen} event={selectedEvent} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
