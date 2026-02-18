import { useState } from "react";
import LayersTree from "../features/map/components/LayersTree";
import MapView from "../features/map/components/MapView";

export default function UserDashboardPage() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="container-fluid vh-100 d-flex flex-column">

      

      {/* ===== MAIN CONTENT ===== */}
      <div className="row flex-grow-1 overflow-hidden">

        {/* ===== LEFT SIDEBAR ===== */}
        <div className="col-2 border-end p-3 overflow-auto">
          <LayersTree onLayersChange={(keys) => console.log("Slojevi:", keys)} />
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

            <MapView />

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
