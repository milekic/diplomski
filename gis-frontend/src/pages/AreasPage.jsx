export default function AreasPage() {
  return (
    <div className="container-fluid vh-100 d-flex flex-column">

      {/* HEADER */}
      <div className="row bg-light border-bottom p-3">
        <h4 className="mb-0">Oblasti</h4>
      </div>

      {/* CONTENT */}
      <div className="row flex-grow-1 p-4">

        <div className="col">

          <div className="border rounded p-3 mb-3">
            <h6>Oblast 1</h6>
            <p className="mb-1">Tip: Poplave</p>
            <small>Status: Nema opasnosti</small>
          </div>

          <div className="border rounded p-3 mb-3">
            <h6>Oblast 2</h6>
            <p className="mb-1">Tip: Temperatura</p>
            <small>Status: Upozorenje</small>
          </div>

          <div className="border rounded p-3">
            <h6>Oblast 3</h6>
            <p className="mb-1">Tip: Požar</p>
            <small>Status: Kritično</small>
          </div>

        </div>

      </div>

    </div>
  );
}
