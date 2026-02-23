import { useEffect, useMemo, useRef, useState } from "react";
import LayersTree from "../features/map/components/LayersTree";
import MapView from "../features/map/components/MapView";
import UserDashboardAreaDetailsPanel from "../features/areas/components/UserDashboardAreaDetailsPanel";
import { getVisibleAreas } from "../features/map/components/visibleAreasApi";

const LEFT_PANEL_WIDTH = 260;
const RIGHT_PANEL_DEFAULT_WIDTH = 340;
const RIGHT_PANEL_MIN_WIDTH = 300;
const MIN_MAP_WIDTH = 420;

export default function UserDashboardPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [eventVisibilityMode, setEventVisibilityMode] = useState("all");
  const [rightPanelWidth, setRightPanelWidth] = useState(RIGHT_PANEL_DEFAULT_WIDTH);
  const isResizingRef = useRef(false);

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

  useEffect(() => {
    const clampWidth = (width) => {
      const viewportWidth = window.innerWidth;
      const maxWidth = Math.max(
        RIGHT_PANEL_MIN_WIDTH,
        viewportWidth - LEFT_PANEL_WIDTH - MIN_MAP_WIDTH
      );
      return Math.min(Math.max(width, RIGHT_PANEL_MIN_WIDTH), maxWidth);
    };

    const onMouseMove = (event) => {
      if (!isResizingRef.current || isExpanded) return;
      const widthFromRight = window.innerWidth - event.clientX;
      setRightPanelWidth(clampWidth(widthFromRight));
    };

    const stopResize = () => {
      if (!isResizingRef.current) return;
      isResizingRef.current = false;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    const onWindowResize = () => {
      setRightPanelWidth((current) => clampWidth(current));
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopResize);
    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopResize);
      window.removeEventListener("resize", onWindowResize);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isExpanded]);

  const startResize = (event) => {
    if (isExpanded) return;
    event.preventDefault();
    isResizingRef.current = true;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      <div className="flex-grow-1 d-flex overflow-hidden">
        {/* Left Sidebar */}
        <div
          className="border-end p-3 overflow-auto flex-shrink-0"
          style={{ width: `${LEFT_PANEL_WIDTH}px` }}
        >
          <LayersTree onLayersChange={setSelectedAreaIds} />
        </div>

        {/* Map Section */}
        <div className="p-3 d-flex flex-column flex-grow-1 overflow-hidden">
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
            className="border rounded position-relative bg-light flex-grow-1"
            style={{ minHeight: 0 ,maxHeight: "90%"}}
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
          <>
            <div
              className="border-start border-end bg-body-tertiary flex-shrink-0"
              role="separator"
              aria-orientation="vertical"
              aria-label="Promijeni širinu panela"
              onMouseDown={startResize}
              style={{ width: "8px", cursor: "col-resize" }}
            />
            <div
              className="border-start p-3 overflow-auto flex-shrink-0"
              style={{ width: `${rightPanelWidth}px`, maxHeight: "95%" }}
            >
              <UserDashboardAreaDetailsPanel
                area={selectedArea}
                measurements={areaMeasurements}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
