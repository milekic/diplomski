export default function AreasTable({
  items = [],
  selectedId = null,

  // pagination props
  currentPage = 1,
  totalPages = 1,
  onPrev = () => {},
  onNext = () => {},
  onGoToPage = () => {},

  onSelect = () => {},
  onAdd = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onManageEvents = () => {},
}) {
  return (
    <div className="d-flex flex-column h-100 gap-2">
      {/* Toolbar */}
      <div className="card border-0 shadow-sm">
        <div className="card-body d-flex align-items-center justify-content-between py-2">
          <span className="badge text-bg-light border text-secondary fw-semibold">
            Oblasti
          </span>

          <div className="btn-toolbar gap-2">
            <div className="btn-group btn-group-sm" role="group" aria-label="Akcije oblasti">
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={() => onEdit(selectedId)}
                disabled={!selectedId}
                title="Izmijeni"
                aria-label="Izmijeni"
              >
                <i className="bi bi-pencil" />
              </button>

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => onManageEvents(selectedId)}
                disabled={!selectedId}
                title="Uredi događaje"
                aria-label="Uredi događaje"
              >
                <i className="bi bi-gear" />
              </button>

              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={onDelete}
                disabled={!selectedId}
                title="Obriši"
                aria-label="Obriši"
              >
                <i className="bi bi-trash" />
              </button>
            </div>

            <button
              type="button"
              className="btn btn-success btn-sm fw-semibold"
              onClick={onAdd}
              title="Dodaj oblast"
              aria-label="Dodaj oblast"
            >
              <i className="bi bi-plus-lg me-1" />
              Dodaj
            </button>
          </div>
        </div>
      </div>

      {/* Table container */}
      <div className="card border-0 shadow-sm flex-grow-1">
        <div className="card-body p-2 p-md-3 d-flex flex-column h-100">
          {/* Table */}
          <div className="table-responsive border rounded-3 flex-grow-1">
            <table
              className="table table-sm table-hover table-striped align-middle mb-0"
              style={{
                "--bs-table-hover-bg": "#e7f1ff",
                "--bs-table-active-bg": "#e7f1ff",
              }}
            >
              <thead
                className="table-primary position-sticky top-0 text-uppercase small"
                style={{ zIndex: 1 }}
              >
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
                      <td className="fw-semibold py-3">{a.name}</td>
                      <td className="py-3">{a.description ?? "-"}</td>
                      <td className="py-3">
                        {a.isGlobal ? (
                          <span className="badge rounded-pill text-bg-success">Da</span>
                        ) : (
                          <span className="badge rounded-pill text-bg-secondary">Ne</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-3">
            <nav aria-label="Areas pagination">
              <ul className="pagination pagination-sm mb-0">
                {/* Previous */}
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    type="button"
                    className="page-link"
                    onClick={onPrev}
                    disabled={currentPage === 1}
                  >
                    Prethodna
                  </button>
                </li>

                {/* Page numbers  */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li
                    key={page}
                    className={`page-item ${page === currentPage ? "active" : ""}`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => onGoToPage(page)}
                      disabled={page === currentPage}
                      aria-label={`Idi na stranicu ${page}`}
                      title={`Idi na stranicu ${page}`}
                    >
                      {page}
                    </button>
                  </li>
                ))}

                {/* Next */}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={onNext}
                    disabled={currentPage === totalPages}
                  >
                    Sljedeća
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
