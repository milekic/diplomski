import { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";   
import { DEFAULT_CENTER_LONLAT,DEFAULT_ZOOM } from "../../../shared/constants/mapConstants";



export default function MapView() {
  const mapDivRef = useRef(null);     
  const mapInstanceRef = useRef(null); 

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = new Map({
      target: mapDivRef.current,
      layers: [
        new TileLayer({
          source: new OSM(), 
        }),
      ],
      view: new View({
        center: fromLonLat (DEFAULT_CENTER_LONLAT),
        zoom: DEFAULT_ZOOM,
      }),
    });

    mapInstanceRef.current = map;

    return () => {
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
