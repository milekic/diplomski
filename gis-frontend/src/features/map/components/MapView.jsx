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
import apiClient from "../../../shared/api/apiClient";
import EventDetailsModal from "./EventDetailsModal";

function toFeatureCollection(geomGeoJson) {
  if (!geomGeoJson) return null;

  try {
    const obj =
      typeof geomGeoJson === "string"
        ? JSON.parse(geomGeoJson)
        : geomGeoJson;

    if (obj?.type === "FeatureCollection" || obj?.type === "Feature")
      return obj;

    return {
      type: "FeatureCollection",
      features: [{ type: "Feature", geometry: obj, properties: {} }],
    };
  } catch {
    return null;
  }
}

const DEFAULT_ICON_URL =
  "https://cdn-icons-png.flaticon.com/512/564/564619.png";

function iconForEventTypeName(nameRaw) {
  const name = (nameRaw || "").toLowerCase();

  if (name.includes("poplav"))
    return "https://cdn-icons-png.flaticon.com/512/1146/1146869.png";

  if (
    name.includes("temperatur") ||
    name.includes("toplot") ||
    name.includes("vruć") ||
    name.includes("vruc")
  )
    return "https://cdn-icons-png.flaticon.com/512/4814/4814268.png";

  if (name.includes("zemljotres") || name.includes("potres"))
    return "https://cdn-icons-png.flaticon.com/512/814/814513.png";

  if (
    name.includes("odron") ||
    name.includes("klizi") ||
    name.includes("klizišt") ||
    name.includes("klizist")
  )
    return "https://cdn-icons-png.flaticon.com/512/684/684908.png";

  return DEFAULT_ICON_URL;
}

export default function MapView({ selectedAreas = [] }) {
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

  const selectedAreaIdSetRef = useRef(selectedAreaIdSet);
  useEffect(() => {
    selectedAreaIdSetRef.current = selectedAreaIdSet;
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

    // 👉 Klik na ikonicu
    map.on("singleclick", (evt) => {
      map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
        if (layer === eventLayerRef.current) {
          const geometry = feature.getGeometry();
          const coords = geometry.getCoordinates();
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

    // 👉 Hover pointer
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
    (async () => {
      try {
        const res = await apiClient.get("/eventtypes");
        const list = Array.isArray(res.data) ? res.data : [];

        const map = {};
        for (const et of list) {
          const id = et.id ?? et.Id;
          const name = et.name ?? et.Name;
          if (id != null) {
            map[Number(id)] = iconForEventTypeName(name);
          }
        }

        setEventTypeIconById(map);
        eventLayerRef.current?.changed();
      } catch {
        setEventTypeIconById({});
      }
    })();
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

  // ===== SIGNALR =====
  useEffect(() => {
    const connection = createMonitoringConnection();

    connection.on("MeasurementUpdated", (payload) => {
      const areaId = Number(payload.areaId ?? payload.AreaId);
      if (!selectedAreaIdSetRef.current.has(areaId)) return;

      const x = payload.x ?? payload.X;
      const y = payload.y ?? payload.Y;
      if (x == null || y == null) return;

      const eventTypeId = Number(
        payload.eventTypeId ?? payload.EventTypeId
      );

      const point = new Point(
        fromLonLat([Number(x), Number(y)])
      );

      const feature = new Feature({ geometry: point });

      feature.set("areaId", areaId);
      feature.set("eventTypeId", eventTypeId);
      feature.set("value", payload.value ?? payload.Value);
      feature.set(
        "measuredAtUtc",
        payload.measuredAtUtc ?? payload.MeasuredAtUtc
      );

      eventSourceRef.current.addFeature(feature);
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
