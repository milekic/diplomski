export default function UserDashboardPage() {
  return (
    <div className="container-fluid vh-100 d-flex flex-column">

      {/* ===== HEADER ===== */}
      <div className="row bg-light border-bottom p-3 align-items-center">
        <div className="col">
          <h4 className="mb-0">GIS sistem za detekciju opasnosti</h4>
        </div>
        <div className="col text-end">
          <span className="me-3">Korisnik</span>
          <button className="btn btn-outline-secondary btn-sm">
            Logout
          </button>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="row flex-grow-1">

        {/* ===== LEFT SIDEBAR ===== */}
        <div className="col-2 border-end p-3">

          <h6>Moje oblasti</h6>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Pretraži..."
          />

          <div className="mb-3">
            <button className="btn btn-sm btn-outline-primary me-1">
              Moje
            </button>
            <button className="btn btn-sm btn-outline-secondary me-1">
              Globalni
            </button>
            <button className="btn btn-sm btn-outline-secondary">
              Uključeni
            </button>
          </div>

          <ul className="list-group mb-3">
            <li className="list-group-item">Oblast 1</li>
            <li className="list-group-item">Oblast 2</li>
            <li className="list-group-item">Oblast 3</li>
          </ul>

          <button className="btn btn-primary w-100">
            + Novi poligon
          </button>

        </div>

        {/* ===== MAP AREA ===== */}
        <div className="col-8 p-3 d-flex flex-column">

          <div className="border rounded flex-grow-1 d-flex justify-content-center align-items-center bg-light">
            <h5 className="text-muted">MAPA (OpenLayers će ići ovdje)</h5>
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
            <button className="btn btn-outline-primary btn-sm">
              + Dodaj događaj
            </button>
            <button className="btn btn-outline-secondary btn-sm">
              Uredi pragove
            </button>
            <button className="btn btn-outline-success btn-sm">
              Istorija
            </button>
            <button className="btn btn-outline-dark btn-sm">
              PDF izvještaj
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
