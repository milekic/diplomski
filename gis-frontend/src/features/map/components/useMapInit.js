import { useEffect } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { defaults as defaultInteractions } from "ol/interaction/defaults";
import { fromLonLat, toLonLat } from "ol/proj";

export default function useMapInit({
  mapRef,
  mapDivRef,
  vectorLayer,
  eventLayer,
  centerLonLat,
  zoom,
  selectedAreaByIdRef,
  onEventFeatureClick,
  onAreaFeatureClick,
}) {
  useEffect(() => {
    if (mapRef.current) return;

    const map = new Map({
      target: mapDivRef.current,
      layers: [new TileLayer({ source: new OSM() }), vectorLayer, eventLayer],
      interactions: defaultInteractions({ doubleClickZoom: false }),
      view: new View({
        center: fromLonLat(centerLonLat),
        zoom,
      }),
    });

    const onSingleClick = (evt) => {
      let clickedArea = null;

      map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
        if (layer === eventLayer) {
          const coords = feature.getGeometry().getCoordinates();
          const lonLat = toLonLat(coords);
          onEventFeatureClick(feature, lonLat);
          return true;
        }

        if (layer === vectorLayer) {
          const areaId = Number(feature.get("areaId"));
          if (!Number.isFinite(areaId)) return false;
          clickedArea = selectedAreaByIdRef.current?.[areaId] ?? null;
        }

        return false;
      });

      if (clickedArea) {
        onAreaFeatureClick(clickedArea);
      }
    };

    const onPointerMove = (e) => {
      const hit = map.hasFeatureAtPixel(e.pixel);
      map.getTargetElement().style.cursor = hit ? "pointer" : "";
    };

    map.on("singleclick", onSingleClick);
    map.on("pointermove", onPointerMove);

    mapRef.current = map;

    return () => {
      map.un("singleclick", onSingleClick);
      map.un("pointermove", onPointerMove);
      map.setTarget(null);
      mapRef.current = null;
    };
  }, []);
}
