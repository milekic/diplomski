import LayersTree from "../features/map/components/LayersTree";
import { Link } from "react-router-dom";
import MapView from "../features/map/components/MapView";


export default function UserDashboardPage() {
  return (
    <div className="container-fluid h-100">

    
      
      {/* ===== MAIN CONTENT ===== */}
      <div className="row h-100">

        {/* ===== LEFT SIDEBAR ===== */}
        <div className="col-2 border-end p-3">

            <LayersTree onLayersChange={(keys) => console.log("Slojevi:", keys)} />

        </div>

        {/* ===== MAP AREA ===== */}
        <div className="col-8 p-3 d-flex flex-column">

          <div className="border rounded flex-grow-1 d-flex justify-content-center align-items-center bg-light">
            <MapView/>
          </div>

        </div>

        {/* ===== RIGHT PANEL ===== */}
        <div className="col-2 border-start p-3">

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

      </div>

    </div>
  );
}
