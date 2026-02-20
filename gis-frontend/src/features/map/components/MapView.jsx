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
import { loadEventTypeIconById } from "./eventTypeIconUtils";

export default function MapView({
  selectedAreas = [],
  eventVisibilityMode = "all",
}) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);

  const vectorSourceRef = useRef(new VectorSource());
  const vectorLayerRef = useRef(
    new VectorLayer({
      source: vectorSourceRef.current,
    })
  );

  const eventSourceRef = useRef(new VectorSource());
  const styleCacheRef = useRef({});

  //  Svi događaji se čuvaju ovdje
  const [allEvents, setAllEvents] = useState([]);
  const [thresholdByAreaAndEvent, setThresholdByAreaAndEvent] = useState(
    {}
  );

  const [eventTypeIconById, setEventTypeIconById] = useState({});
  const eventTypeIconByIdRef = useRef(eventTypeIconById);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    eventTypeIconByIdRef.current = eventTypeIconById;
  }, [eventTypeIconById]);

  const eventLayerRef = useRef(
    new VectorLayer({
      source: eventSourceRef.current,
      style: (feature) => {
        const eventTypeId = Number(feature.get("eventTypeId"));
        const iconUrl =
          eventTypeIconByIdRef.current?.[eventTypeId] ||
          DEFAULT_ICON_URL;

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
    return new Set(
      selectedAreas
        .map((a) => Number(a.id ?? a.Id))
        .filter(Number.isFinite)
    );
  }, [selectedAreas]);

  const selectedAreaIds = useMemo(() => {
    return [...selectedAreaIdSet];
  }, [selectedAreaIdSet]);

  // ===== INIT MAP =====
  useEffect(() => {
    if (mapRef.current) return;

    const map = new Map({
      target: mapDivRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        vectorLayerRef.current,
        eventLayerRef.current,
      ],
      view: new View({
        center: fromLonLat(DEFAULT_CENTER_LONLAT),
        zoom: DEFAULT_ZOOM,
      }),
    });

    // Klik na ikonicu
    map.on("singleclick", (evt) => {
      map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
        if (layer === eventLayerRef.current) {
          const coords = feature.getGeometry().getCoordinates();
          const lonLat = toLonLat(coords);

          setSelectedEvent({
            areaId: feature.get("areaId"),
            eventTypeId: feature.get("eventTypeId"),
            value: feature.get("value"),
            measuredAtUtc: feature.get("measuredAtUtc"),
            x: lonLat?.[0],
            y: lonLat?.[1],
          });

          setIsModalOpen(true);
          return true;
        }
      });
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
      const map = await loadEventTypeIconById();
      if (cancelled) return;
      setEventTypeIconById(map);
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

  // FILTRIRANJE EVENTA PREMA ČEKIRANIM OBLASTIMA
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
        const point = new Point(
          fromLonLat([Number(e.x), Number(e.y)])
        );

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

    connection.on("MeasurementUpdated", (payload) => {
      const areaId = Number(payload.areaId ?? payload.AreaId);

      const x = payload.x ?? payload.X;
      const y = payload.y ?? payload.Y;
      if (x == null || y == null) return;

      const eventTypeId = Number(
        payload.eventTypeId ?? payload.EventTypeId
      );

      // Dodaj u React state (ne direktno na mapu)
      setAllEvents((prev) => [
        ...prev,
        {
          areaId,
          eventTypeId,
          value: payload.value ?? payload.Value,
          measuredAtUtc:
            payload.measuredAtUtc ?? payload.MeasuredAtUtc,
          x: Number(x),
          y: Number(y),
        },
      ]);
    });

    connection.start().catch(() =>
      console.error("SignalR error")
    );

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <>
      <div
        ref={mapDivRef}
        style={{ width: "100%", height: "100%" }}
      />

      <EventDetailsModal
        show={isModalOpen}
        event={selectedEvent}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
