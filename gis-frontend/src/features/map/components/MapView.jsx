import { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import GeoJSON from "ol/format/GeoJSON";
import { fromLonLat } from "ol/proj";
import { DEFAULT_CENTER_LONLAT, DEFAULT_ZOOM, GEOJSON_DATA_PROJECTION, MAP_VIEW_PROJECTION, } from "../../../shared/constants/mapConstants";

function toFeatureCollection(geomGeoJson) {
  if (!geomGeoJson) return null;

  // Ako backend vraća Feature/FeatureCollection, vrati kako jeste
  try {
    const obj = typeof geomGeoJson === "string" ? JSON.parse(geomGeoJson) : geomGeoJson;
    if (obj?.type === "FeatureCollection" || obj?.type === "Feature") return obj;

    // Ako je samo Geometry (npr. Polygon), wrap u FeatureCollection
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

  const vectorSourceRef = useRef(new VectorSource());
  const vectorLayerRef = useRef(
    new VectorLayer({
      source: vectorSourceRef.current,
    })
  );

  
  useEffect(() => {
    if (mapRef.current) return;

    const map = new Map({
      target: mapDivRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        vectorLayerRef.current, 
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

    // zoom na selektovane 
    // const extent = source.getExtent();
    //if (extent && isFinite(extent[0])) mapRef.current?.getView().fit(extent, { padding: [30, 30, 30, 30], maxZoom: 14 });

  }, [selectedAreas]);

  return <div ref={mapDivRef} style={{ width: "100%", height: "100%" }} />;
}
