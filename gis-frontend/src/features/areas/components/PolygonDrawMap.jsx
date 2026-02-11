import { useEffect, useMemo, useRef } from "react";

import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";
import Draw from "ol/interaction/Draw";
import GeoJSON from "ol/format/GeoJSON";
import { DEFAULT_CENTER_LONLAT,DEFAULT_ZOOM } from "../../../shared/constants/mapConstants";

export default function PolygonDrawMap({
  onGeoJsonChange = () => {},
  height = 300,
  centerLonLat,
  zoom = DEFAULT_ZOOM,
}) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);

  const vectorSourceRef = useRef(new VectorSource());
  const drawRef = useRef(null);

  
  const stableCenter = useMemo(() => {
    return Array.isArray(centerLonLat) ? centerLonLat : DEFAULT_CENTER_LONLAT;
  }, [centerLonLat?.[0], centerLonLat?.[1]]);

 
  useEffect(() => {
    if (mapRef.current) return;

    const raster = new TileLayer({ source: new OSM() });
    const vectorLayer = new VectorLayer({ source: vectorSourceRef.current });

    const map = new Map({
      target: mapDivRef.current,
      layers: [raster, vectorLayer],
      view: new View({
        center: fromLonLat(stableCenter),
        zoom,
      }),
    });

    const draw = new Draw({
      source: vectorSourceRef.current,
      type: "Polygon",
    });

    draw.on("drawend", (e) => {
  vectorSourceRef.current.clear();
  vectorSourceRef.current.addFeature(e.feature);

  const format = new GeoJSON();
  const geojsonObj = format.writeFeatureObject(e.feature, {
    featureProjection: "EPSG:3857",
    dataProjection: "EPSG:4326",
  });

  onGeoJsonChange(JSON.stringify(geojsonObj));
  drawRef.current?.setActive(false);
});


    map.addInteraction(draw);

    mapRef.current = map;
    drawRef.current = draw;

    return () => {
      map.setTarget(null);
      mapRef.current = null;
      drawRef.current = null;
    };
  }, []);

  
  useEffect(() => {
    if (!mapRef.current) return;
    const view = mapRef.current.getView();
    view.setCenter(fromLonLat(stableCenter));
    view.setZoom(zoom);
  }, [stableCenter, zoom]);

  useEffect(() => {
    const t = setTimeout(() => {
      mapRef.current?.updateSize();
    }, 0);
    return () => clearTimeout(t);
  }, []);


 const clear = () => {
  vectorSourceRef.current.clear();
  onGeoJsonChange("");
  drawRef.current?.setActive(true);
};


  return (
    <div className="d-flex flex-column gap-2">
      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={clear}
        >
          Očisti poligon
        </button>
        <div className="text-muted small d-flex align-items-center">
          Klikni tačke za poligon, double-click za završetak.
        </div>
      </div>

      <div
        ref={mapDivRef}
        className="border rounded"
        style={{ width: "100%", height }}
      />
    </div>
  );
}
