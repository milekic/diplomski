import { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
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

export default function MapView({ selectedAreas = [] }) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);

  // ===== POLYGON LAYER =====
  const vectorSourceRef = useRef(new VectorSource());
  const vectorLayerRef = useRef(
    new VectorLayer({
      source: vectorSourceRef.current,
    })
  );

  // ===== EVENT LAYER (⚠️ IKONICE) =====
  const eventSourceRef = useRef(new VectorSource());
  const eventLayerRef = useRef(
    new VectorLayer({
      source: eventSourceRef.current,
      style: new Style({
        image: new Icon({
          src: "https://cdn-icons-png.flaticon.com/512/564/564619.png",
          scale: 0.05,
          anchor: [0.5, 1],
        }),
      }),
    })
  );

  // ===== INIT MAP =====
  useEffect(() => {
    if (mapRef.current) return;

    const map = new Map({
      target: mapDivRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        vectorLayerRef.current,
        eventLayerRef.current, // 👈 dodan layer za događaje
      ],
      view: new View({
        center: fromLonLat(DEFAULT_CENTER_LONLAT),
        zoom: DEFAULT_ZOOM,
      }),
    });

    mapRef.current = map;

    return () => {
      map.setTarget(null);
      mapRef.current = null;
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

  // ===== SIGNALR REALTIME EVENTS =====
  useEffect(() => {
    const connection = createMonitoringConnection();

    connection.on("MeasurementUpdated", (payload) => {
      const source = eventSourceRef.current;

      // transformacija koordinata (WGS84 → 3857)
      const point = new Point(
        fromLonLat([payload.x, payload.y])
      );

      const feature = new Feature({
        geometry: point,
        areaId: payload.areaId,
        eventTypeId: payload.eventTypeId,
        value: payload.value,
      });

      source.addFeature(feature);
    });

    connection
      .start()
      .catch((err) => console.error("❌ SignalR error"));

    return () => {
      connection.stop();
    };
  }, []);

  return <div ref={mapDivRef} style={{ width: "100%", height: "100%" }} />;
}
