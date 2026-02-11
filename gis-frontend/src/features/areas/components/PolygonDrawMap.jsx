import { useEffect, useMemo, useRef } from "react";

import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";

import Draw from "ol/interaction/Draw";
import Modify from "ol/interaction/Modify";
import Snap from "ol/interaction/Snap";
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
  const modifyRef = useRef(null);
  const snapRef = useRef(null);

  const stableCenter = useMemo(() => {
    return Array.isArray(centerLonLat) ? centerLonLat : DEFAULT_CENTER_LONLAT;
  }, [centerLonLat?.[0], centerLonLat?.[1]]);

  const writeCurrentFeatureToGeoJson = () => {
    const feature = vectorSourceRef.current.getFeatures()?.[0];
    if (!feature) {
      onGeoJsonChange("");
      return;
    }

    const format = new GeoJSON();
    const geojsonObj = format.writeFeatureObject(feature, {
      featureProjection: "EPSG:3857",
      dataProjection: "EPSG:4326",
    });

    onGeoJsonChange(JSON.stringify(geojsonObj));
  };

  // ukloni modify/snap ako postoje
  const detachModifyAndSnap = () => {
    const map = mapRef.current;
    if (!map) return;

    if (modifyRef.current) {
      map.removeInteraction(modifyRef.current);
      modifyRef.current = null;
    }
    if (snapRef.current) {
      map.removeInteraction(snapRef.current);
      snapRef.current = null;
    }
  };

  // ukloni draw ako postoji
  const detachDraw = () => {
    const map = mapRef.current;
    if (!map) return;

    if (drawRef.current) {
      map.removeInteraction(drawRef.current);
      drawRef.current = null;
    }
  };

  // uključi Modify (+ Snap) za postojeći poligon
  const attachModifyAndSnap = () => {
    const map = mapRef.current;
    if (!map) return;

    // osiguraj da nema duplih
    detachModifyAndSnap();

    const modify = new Modify({
      source: vectorSourceRef.current,
    });

    modify.on("modifyend", () => {
      // nakon pomjeranja tačaka, ažuriraj GeoJSON u formi
      writeCurrentFeatureToGeoJson();
    });

    const snap = new Snap({
      source: vectorSourceRef.current,
    });

    map.addInteraction(modify);
    map.addInteraction(snap);

    modifyRef.current = modify;
    snapRef.current = snap;
  };

  // fresh Draw instance (za novi poligon)
  const attachFreshDraw = () => {
    const map = mapRef.current;
    if (!map) return;

    // kad crtamo novi, ne trebaju modify/snap
    detachModifyAndSnap();
    detachDraw();

    const draw = new Draw({
      source: vectorSourceRef.current,
      type: "Polygon",
    });

    draw.on("drawend", (e) => {
      // samo 1 poligon
      vectorSourceRef.current.clear();
      vectorSourceRef.current.addFeature(e.feature);

      // upiši GeoJSON odmah
      writeCurrentFeatureToGeoJson();

      // ugasi crtanje
      draw.setActive(false);

      // i uključi pomjeranje tačaka (modify)
      attachModifyAndSnap();
    });

    map.addInteraction(draw);
    drawRef.current = draw;

    // bitno: prvi klik odmah radi
    draw.setActive(true);
  };

  // 1) init map
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

    // ukloni DoubleClickZoom da double-click bude završetak crtanja
    map.getInteractions().forEach((i) => {
      if (i instanceof DoubleClickZoom) map.removeInteraction(i);
    });

    mapRef.current = map;

    // default: omogućimo crtanje (ako nema initialGeoJson)
    attachFreshDraw();

    return () => {
      map.setTarget(null);
      mapRef.current = null;
      drawRef.current = null;
      modifyRef.current = null;
      snapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) center/zoom update
  useEffect(() => {
    if (!mapRef.current) return;
    const view = mapRef.current.getView();
    view.setCenter(fromLonLat(stableCenter));
    view.setZoom(zoom);
  }, [stableCenter, zoom]);

  // 3) updateSize (modal)
  useEffect(() => {
    const t = setTimeout(() => {
      mapRef.current?.updateSize();
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // 4) load existing polygon (edit)
  useEffect(() => {
    if (!mapRef.current) return;

    if (!initialGeoJson || !String(initialGeoJson).trim()) {
      // nema poligona → crtanje
      vectorSourceRef.current.clear();
      attachFreshDraw();
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
        const geom = format.readGeometry(obj, { featureProjection: "EPSG:3857" });
        featureToAdd = new Feature({ geometry: geom });
      }

      if (!featureToAdd) return;

      vectorSourceRef.current.clear();
      vectorSourceRef.current.addFeature(featureToAdd);

      // fit
      const extent = vectorSourceRef.current.getExtent();
      mapRef.current.getView().fit(extent, {
        padding: [40, 40, 40, 40],
        duration: 300,
        maxZoom: 16,
      });

      // edit mode → nema crtanja, samo modify
      detachDraw();
      attachModifyAndSnap();
    } catch (err) {
      console.error("Greška pri učitavanju initialGeoJson:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialGeoJson]);

  const clear = () => {
    vectorSourceRef.current.clear();
    onGeoJsonChange("");

    // vrati u režim crtanja (prvi klik radi)
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

        
      </div>

      <div
        ref={mapDivRef}
        className="border rounded"
        style={{ width: "100%", height }}
      />
    </div>
  );
}
