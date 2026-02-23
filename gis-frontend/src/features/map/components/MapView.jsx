import { useEffect, useMemo, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import GeoJSON from "ol/format/GeoJSON";
import { fromLonLat, toLonLat } from "ol/proj";
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

  const parseMeasuredAtMs = (measuredAtUtc) => {
    if (!measuredAtUtc) return null;
    const ms = Date.parse(measuredAtUtc);
    return Number.isFinite(ms) ? ms : null;
  };

  const normalizeMeasuredAtUtc = (rawValue) => {
    if (rawValue == null) return null;

    const toIsoFromNumber = (numeric) => {
      if (!Number.isFinite(numeric)) return null;
      const ms = numeric > 1e12 ? numeric : numeric * 1000;
      const date = new Date(ms);
      return Number.isNaN(date.getTime()) ? null : date.toISOString();
    };

    if (typeof rawValue === "number") {
      return toIsoFromNumber(rawValue);
    }

    if (typeof rawValue === "string") {
      const trimmed = rawValue.trim();
      if (!trimmed) return null;

      if (/^\d+$/.test(trimmed)) {
        return toIsoFromNumber(Number(trimmed));
      }

      const parsed = Date.parse(trimmed);
      if (Number.isFinite(parsed)) {
        return new Date(parsed).toISOString();
      }
    }

    return null;
  };

  const normalizeEventForPanel = (eventItem, fallbackAreaId) => {
    const areaId = Number(eventItem?.areaId ?? eventItem?.AreaId ?? fallbackAreaId);
    const eventTypeId = Number(eventItem?.eventTypeId ?? eventItem?.EventTypeId);
    const value =
      eventItem?.value ??
      eventItem?.Value ??
      eventItem?.measuredValue ??
      eventItem?.MeasuredValue ??
      null;
    const measuredAtRaw =
      eventItem?.measuredAtUtc ??
      eventItem?.MeasuredAtUtc ??
      eventItem?.measuredAt ??
      eventItem?.MeasuredAt ??
      eventItem?.measurementTimeUtc ??
      eventItem?.MeasurementTimeUtc ??
      eventItem?.measurementTime ??
      eventItem?.MeasurementTime ??
      eventItem?.timeOfMeasurement ??
      eventItem?.TimeOfMeasurement ??
      eventItem?.timestamp ??
      eventItem?.Timestamp ??
      eventItem?.createdAt ??
      eventItem?.CreatedAt ??
      null;
    const measuredAtUtc = normalizeMeasuredAtUtc(measuredAtRaw);
    const unit = eventItem?.eventTypeUnit ?? eventItem?.EventTypeUnit ?? "";
    const backendEventTypeName = eventItem?.eventTypeName ?? eventItem?.EventTypeName;

    return {
      areaId,
      eventTypeId,
      value,
      measuredAtUtc,
      unit,
      backendEventTypeName,
    };
  };

  const buildPanelMeasurements = ({ areaId, liveEvents = [], databaseEvents = [], cutoffMs }) => {
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
        const typeNameFromMeta = eventTypeNameByIdRef.current?.[item.eventTypeId];
        const unitFromMeta = eventTypeUnitByIdRef.current?.[item.eventTypeId] ?? "";
        return {
          id: `${areaId}-${item.eventTypeId}-${item.measuredAtUtc ?? "no-time"}-${index}`,
          eventTypeName: item.backendEventTypeName ?? typeNameFromMeta ?? "-",
          value: item.value,
          unit: item.unit || unitFromMeta,
          measuredAtUtc: item.measuredAtUtc,
        };
      })
      .sort((a, b) => {
        const timeA = a.measuredAtUtc ? Date.parse(a.measuredAtUtc) : 0;
        const timeB = b.measuredAtUtc ? Date.parse(b.measuredAtUtc) : 0;
        return timeB - timeA;
      });
  };

  const getDatabaseEventsForArea = async (areaId) => {
    if (Object.prototype.hasOwnProperty.call(databaseEventsByAreaIdRef.current, areaId)) {
      return databaseEventsByAreaIdRef.current[areaId];
    }

    const rows = await loadAreaMeasurements(areaId);
    const normalizedRows = Array.isArray(rows) ? rows : [];
    databaseEventsByAreaIdRef.current[areaId] = normalizedRows;
    return normalizedRows;
  };

  const showAreaSnapshotMeasurements = async (area) => {
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
    });
    onAreaMeasurementsChangeRef.current?.(liveOnlyMeasurements);

    const databaseEvents = await getDatabaseEventsForArea(areaId);
    if (snapshotToken !== panelSnapshotTokenRef.current) return;

    const fullSnapshotMeasurements = buildPanelMeasurements({
      areaId,
      liveEvents: snapshotLiveEvents,
      databaseEvents,
      cutoffMs: snapshotCutoffMs,
    });
    onAreaMeasurementsChangeRef.current?.(fullSnapshotMeasurements);
  };

  // ===== INIT MAP =====
  useEffect(() => {
    if (mapRef.current) return;

    const map = new Map({
      target: mapDivRef.current,
      layers: [new TileLayer({ source: new OSM() }), vectorLayerRef.current, eventLayerRef.current],
      view: new View({
        center: fromLonLat(DEFAULT_CENTER_LONLAT),
        zoom: DEFAULT_ZOOM,
      }),
    });

    map.on("singleclick", (evt) => {
      let clickedArea = null;

      map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
        if (layer === eventLayerRef.current) {
          const coords = feature.getGeometry().getCoordinates();
          const lonLat = toLonLat(coords);

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
          return true;
        }

        if (layer === vectorLayerRef.current) {
          const areaId = Number(feature.get("areaId"));
          if (!Number.isFinite(areaId)) return false;
          clickedArea = selectedAreaByIdRef.current?.[areaId] ?? null;
        }

        return false;
      });

      if (clickedArea) {
        onAreaSelectRef.current?.(clickedArea);
        showAreaSnapshotMeasurements(clickedArea);
      }
    });

    map.on("pointermove", function (e) {
      const hit = map.hasFeatureAtPixel(e.pixel);
      map.getTargetElement().style.cursor = hit ? "pointer" : "";
    });

    mapRef.current = map;

    return () => {
      map.setTarget(null);
      mapRef.current = null;
    };
  }, []);

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
