export default function AreasTable({
  items = [],
  selectedId = null,

  // pagination props
  currentPage = 1,
  totalPages = 1,
  onPrev = () => {},
  onNext = () => {},

  onSelect = () => {},
  onAdd = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onViewDetails = () => {},
}) {
  return (
    <div className="d-flex flex-column h-100">
      {/* Toolbar */}
      <div className="d-flex align-items-center gap-2 mb-2">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={onViewDetails}
          disabled={!selectedId}
        >
          Pregled detalja
        </button>

        <button
          className="btn btn-outline-dark btn-sm"
          onClick={() => onEdit(selectedId)}
          disabled={!selectedId}
        >
          Edit
        </button>

        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => onDelete(selectedId)}
          disabled={!selectedId}
        >
          Obriši
        </button>

        <button className="btn btn-success btn-sm" onClick={onAdd}>
          + Dodaj
        </button>
      </div>

      {/* Table container */}
      <div className="border rounded flex-grow-1 bg-light p-2 d-flex flex-column">
        <div className="flex-grow-1" style={{ overflow: "auto" }}>
          <table className="table table-sm table-hover align-middle mb-0">
            <thead className="table-light position-sticky top-0">
              <tr>
                <th>Naziv</th>
                <th>Opis</th>
                <th style={{ width: 120 }}>Globalna</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-muted py-4">
                    Nema oblasti za prikaz.
                  </td>
                </tr>
              ) : (
                items.map((a) => (
                  <tr
                    key={a.id}
                    role="button"
                    className={selectedId === a.id ? "table-active" : ""}
                    onClick={() => onSelect(a)}
                  >
                    <td className="fw-semibold">{a.name}</td>
                    <td>{a.description ?? "-"}</td>
                    <td>
                      {a.isGlobal ? (
                        <span className="badge text-bg-success">Da</span>
                      ) : (
                        <span className="badge text-bg-secondary">Ne</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-2 small text-muted">
          <div>
            Stranica {currentPage} od {totalPages}
          </div>

          <div className="btn-group btn-group-sm">
            <button
              className="btn btn-outline-secondary"
              onClick={onPrev}
              disabled={currentPage === 1}
            >
              Prethodna
            </button>

            <button className="btn btn-primary" disabled>
              {currentPage}
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={onNext}
              disabled={currentPage === totalPages}
            >
              Sljedeća
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
