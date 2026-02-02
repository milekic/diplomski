import { useEffect, useRef } from "react";

// OpenLayers
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";



export default function MapView() {
  const mapDivRef = useRef(null);     // <div> u koji OL crta mapu
  const mapInstanceRef = useRef(null); // da sačuvamo mapu između rendera

  useEffect(() => {
    // spriječi duplo kreiranje mape (React StrictMode u dev modu može okinuti effect 2x)
    if (mapInstanceRef.current) return;

    const map = new Map({
      target: mapDivRef.current,
      layers: [
        new TileLayer({
          source: new OSM(), // osnovna mapa: OpenStreetMap
        }),
      ],
      view: new View({
        center: [0, 0], // u Web Mercator koordinatama
        zoom: 2,
      }),
    });

    mapInstanceRef.current = map;

    return () => {
      // cleanup kad komponenta nestane
      map.setTarget(null);
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div
      ref={mapDivRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
