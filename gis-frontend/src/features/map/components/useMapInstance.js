import { useEffect, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";

//Kreiranje OpenLayers mape
export default function useMapInstance({
  targetRef,
  vectorLayer,
  eventLayer,
  centerLonLat,
  zoom,
}) {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!targetRef.current || map) return;

    const instance = new Map({
      target: targetRef.current,
      layers: [new TileLayer({ source: new OSM() }), vectorLayer, eventLayer],
      view: new View({
        center: fromLonLat(centerLonLat),
        zoom,
      }),
    });

    const onPointerMove = (event) => {
      const hit = instance.hasFeatureAtPixel(event.pixel);
      instance.getTargetElement().style.cursor = hit ? "pointer" : "";
    };

    instance.on("pointermove", onPointerMove);
    setMap(instance);

    return () => {
      instance.un("pointermove", onPointerMove);
      instance.setTarget(null);
      setMap(null);
    };
  }, [targetRef, vectorLayer, eventLayer, centerLonLat, zoom, map]);

  return map;
}
