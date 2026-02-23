import { useEffect, useMemo, useState } from "react";
import LayersTree from "../features/map/components/LayersTree";
import MapView from "../features/map/components/MapView";
import UserDashboardAreaDetailsPanel from "../features/areas/components/UserDashboardAreaDetailsPanel";
import { getVisibleAreas } from "../features/map/components/visibleAreasApi";

export default function UserDashboardPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [eventVisibilityMode, setEventVisibilityMode] = useState("all");

  // All visible areas (owned + global)
  const [areas, setAreas] = useState([]);

  // Checked area ids from LayersTree
  const [selectedAreaIds, setSelectedAreaIds] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [areaMeasurements, setAreaMeasurements] = useState([]);

  // Load areas once
  useEffect(() => {
    (async () => {
      try {
        const data = await getVisibleAreas();
        setAreas(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Unable to load visible areas");
        setAreas([]);
      }
    })();
  }, []);

  // Build selected areas for map rendering
  const selectedAreas = useMemo(() => {
    const ids = new Set(selectedAreaIds.map((id) => Number(id)));
    return areas.filter((area) => ids.has(Number(area.id ?? area.Id)));
  }, [areas, selectedAreaIds]);

  // Keep selected area valid after LayersTree changes
  useEffect(() => {
    if (!selectedArea) return;

    const selectedId = Number(selectedArea.id ?? selectedArea.Id);
    const stillVisible = selectedAreas.some(
      (area) => Number(area.id ?? area.Id) === selectedId
    );

    if (!stillVisible) {
      setSelectedArea(null);
      setAreaMeasurements([]);
    }
  }, [selectedArea, selectedAreas]);

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      <div className="row flex-grow-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="col-2 border-end p-3 overflow-auto">
          <LayersTree onLayersChange={setSelectedAreaIds} />
        </div>

        {/* Map Section */}
        <div className={`${isExpanded ? "col-10" : "col-8"} p-3 d-flex flex-column`}>
          <div className="d-flex align-items-center gap-3 mb-2">
            <span className="fw-semibold small mb-0">Prikaz dogadjaja:</span>

            <div className="form-check form-check-inline mb-0">
              <input
                className="form-check-input"
                type="radio"
                name="eventVisibilityMode"
                id="event-mode-all"
                checked={eventVisibilityMode === "all"}
                onChange={() => setEventVisibilityMode("all")}
              />
              <label className="form-check-label small" htmlFor="event-mode-all">
                Svi dogadjaji
              </label>
            </div>

            <div className="form-check form-check-inline mb-0">
              <input
                className="form-check-input"
                type="radio"
                name="eventVisibilityMode"
                id="event-mode-critical"
                checked={eventVisibilityMode === "criticalOnly"}
                onChange={() => setEventVisibilityMode("criticalOnly")}
              />
              <label className="form-check-label small" htmlFor="event-mode-critical">
                Samo kriticni
              </label>
            </div>
          </div>

          <div
            className="border rounded position-relative bg-light"
            style={{ height: "90%" }}
          >
            <button
              className="btn btn-sm btn-outline-secondary position-absolute"
              style={{ top: "10px", right: "10px", zIndex: 1000 }}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "<<" : ">>"}
            </button>

            {/* Map View */}
            <MapView
              selectedAreas={selectedAreas}
              eventVisibilityMode={eventVisibilityMode}
              onAreaSelect={setSelectedArea}
              onAreaMeasurementsChange={setAreaMeasurements}
            />
          </div>
        </div>

        {/* Right Panel */}
        {!isExpanded && (
          <div className="col-2 border-start p-3 overflow-auto" style={{ height: "94%" }}>
            <UserDashboardAreaDetailsPanel
              area={selectedArea}
              measurements={areaMeasurements}
            />
          </div>
        )}
      </div>
    </div>
  );
}
