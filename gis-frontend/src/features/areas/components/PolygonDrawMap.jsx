import { useEffect, useMemo, useRef } from "react";

import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";
import Draw from "ol/interaction/Draw";
import DoubleClickZoom from "ol/interaction/DoubleClickZoom";
import GeoJSON from "ol/format/GeoJSON";
import Feature from "ol/Feature";

import {
  DEFAULT_CENTER_LONLAT,
  DEFAULT_ZOOM,
} from "../../../shared/constants/mapConstants";

export default function PolygonDrawMap({
  onGeoJsonChange = () => {},
  height = 300,
  centerLonLat,
  zoom = DEFAULT_ZOOM,
  initialGeoJson = null,
}) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);

  const vectorSourceRef = useRef(new VectorSource());
  const drawRef = useRef(null);

  const stableCenter = useMemo(() => {
    return Array.isArray(centerLonLat) ? centerLonLat : DEFAULT_CENTER_LONLAT;
  }, [centerLonLat?.[0], centerLonLat?.[1]]);

  // helper: napravi i dodaj Draw interaction (fresh instance)
  const attachFreshDraw = () => {
    const map = mapRef.current;
    if (!map) return;

    // ukloni stari draw ako postoji
    if (drawRef.current) {
      map.removeInteraction(drawRef.current);
      drawRef.current = null;
    }

    const draw = new Draw({
      source: vectorSourceRef.current,
      type: "Polygon",
    });

    draw.on("drawend", (e) => {
      // dozvoljavamo samo 1 poligon
      vectorSourceRef.current.clear();
      vectorSourceRef.current.addFeature(e.feature);

      const format = new GeoJSON();
      const geojsonObj = format.writeFeatureObject(e.feature, {
        featureProjection: "EPSG:3857",
        dataProjection: "EPSG:4326",
      });

      onGeoJsonChange(JSON.stringify(geojsonObj));

      // nakon završetka, ugasi crtanje
      draw.setActive(false);
    });

    map.addInteraction(draw);
    drawRef.current = draw;

    // bitno: odmah aktiviraj da prvi klik radi
    draw.setActive(true);
  };

  // 1) inicijalizacija mape (samo jednom)
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

    // ukloni DoubleClickZoom da double-click bude “završetak poligona”
    map.getInteractions().forEach((i) => {
      if (i instanceof DoubleClickZoom) {
        map.removeInteraction(i);
      }
    });

    mapRef.current = map;

    // odmah dodaj draw (create mode, bez početnog poligona)
    attachFreshDraw();

    return () => {
      map.setTarget(null);
      mapRef.current = null;
      drawRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) centar/zoom update (ako ti treba)
  useEffect(() => {
    if (!mapRef.current) return;
    const view = mapRef.current.getView();
    view.setCenter(fromLonLat(stableCenter));
    view.setZoom(zoom);
  }, [stableCenter, zoom]);

  // 3) updateSize (da mapa bude pravilno prikazana u modalu)
  useEffect(() => {
    const t = setTimeout(() => {
      mapRef.current?.updateSize();
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // 4) učitaj postojeći poligon (edit mode)
  useEffect(() => {
    if (!mapRef.current) return;

    // ako nema geojson-a → u create modu ostavi draw aktivan
    if (!initialGeoJson || !String(initialGeoJson).trim()) {
      // osiguraj da crtanje radi odmah
      if (drawRef.current) drawRef.current.setActive(true);
      return;
    }

    try {
      const format = new GeoJSON();
      const obj =
        typeof initialGeoJson === "string"
          ? JSON.parse(initialGeoJson)
          : initialGeoJson;

      let featureToAdd = null;

      if (obj?.type === "Feature") {
        featureToAdd = format.readFeature(obj, { featureProjection: "EPSG:3857" });
      } else if (
        obj?.type === "FeatureCollection" &&
        Array.isArray(obj.features) &&
        obj.features[0]
      ) {
        featureToAdd = format.readFeature(obj.features[0], {
          featureProjection: "EPSG:3857",
        });
      } else {
        // Geometry (Polygon/MultiPolygon/...)
        const geom = format.readGeometry(obj, { featureProjection: "EPSG:3857" });
        featureToAdd = new Feature({ geometry: geom });
      }

      if (!featureToAdd) return;

      vectorSourceRef.current.clear();
      vectorSourceRef.current.addFeature(featureToAdd);

      // fit na poligon
      const extent = vectorSourceRef.current.getExtent();
      mapRef.current.getView().fit(extent, {
        padding: [40, 40, 40, 40],
        duration: 300,
        maxZoom: 16,
      });

      // pošto već postoji poligon → ugasi crtanje
      drawRef.current?.setActive(false);
    } catch (err) {
      console.error("Greška pri učitavanju initialGeoJson:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialGeoJson]);

  // Očisti poligon i “restartuj” draw da 1. klik odmah krene
  const clear = () => {
    vectorSourceRef.current.clear();
    onGeoJsonChange("");

    // ključna stvar: fresh draw instance
    attachFreshDraw();
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
