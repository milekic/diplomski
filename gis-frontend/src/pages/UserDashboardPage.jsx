import { useEffect, useMemo, useState } from "react";
import LayersTree from "../features/map/components/LayersTree";
import MapView from "../features/map/components/MapView";
import { getVisibleAreas } from "../features/map/components/visibleAreasApi"; // ako ti je druga putanja, prilagodi

export default function UserDashboardPage() {
  const [isExpanded, setIsExpanded] = useState(false);

  // sve oblasti (moje + globalne)
  const [areas, setAreas] = useState([]);

  // čekirani ID-evi iz tree-a
  const [selectedAreaIds, setSelectedAreaIds] = useState([]);

  // učitaj oblasti jednom
  useEffect(() => {
    (async () => {
      try {
        const data = await getVisibleAreas();
        setAreas(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Ne mogu učitati oblasti");
        setAreas([]);
      }
    })();
  }, []);

  // izračunaj selektovane oblasti 
  const selectedAreas = useMemo(() => {
    const setIds = new Set(selectedAreaIds);
    return areas.filter((a) => setIds.has(a.id ?? a.Id));
  }, [areas, selectedAreaIds]);

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      {/* ===== MAIN CONTENT ===== */}
      <div className="row flex-grow-1 overflow-hidden">
        {/* ===== LEFT SIDEBAR ===== */}
        <div className="col-2 border-end p-3 overflow-auto">
          {/* umjesto console.log, setuj state */}
          <LayersTree onLayersChange={setSelectedAreaIds} />
        </div>

        {/* ===== MAP AREA ===== */}
        <div className={`${isExpanded ? "col-10" : "col-8"} p-3 d-flex flex-column`}>
          <div
            className="border rounded position-relative bg-light"
            style={{ height: "92%" }}
          >
            {/* Toggle dugme */}
            <button
              className="btn btn-sm btn-outline-secondary position-absolute"
              style={{ top: "10px", right: "10px", zIndex: 1000 }}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "⮜" : "⮞"}
            </button>

            {/* proslijedi selektovane oblasti */}
            <MapView selectedAreas={selectedAreas} />
          </div>
        </div>

        {/* ===== RIGHT PANEL ===== */}
        {!isExpanded && (
          <div className="col-2 border-start p-3 overflow-auto">
            <h6>Detalji oblasti</h6>

            <div className="mb-3">
              <strong>Oblast:</strong> Nije selektovana
            </div>

            <div className="mb-2 p-2 border rounded">
              <p className="mb-1"><strong>Poplave</strong></p>
              <small>Prag: -</small><br />
              <small>Trenutna vrijednost: -</small>
            </div>

            <div className="mb-2 p-2 border rounded">
              <p className="mb-1"><strong>Temperatura</strong></p>
              <small>Prag: -</small><br />
              <small>Trenutna vrijednost: -</small>
            </div>

            <div className="d-grid gap-2 mt-3">
              <button className="btn btn-outline-dark btn-sm">
                PDF izvještaj
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
