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
  onViewDetails = () => {},
  onManageEvents = () => {},
}) {
  return (
    <div className="d-flex flex-column h-100">
      
{/* Toolbar */}
<div className="d-flex align-items-center justify-content-end mb-2">
  <div className="d-flex align-items-center gap-2">

    <button
      type="button"
      className="btn btn-outline-secondary btn-sm"
      onClick={onViewDetails}
      disabled={!selectedId}
      title="Pregled detalja"
      aria-label="Pregled detalja"
    >
      <i className="bi bi-eye" />
    </button>

    <button
      type="button"
      className="btn btn-outline-dark btn-sm"
      onClick={() => onEdit(selectedId)}
      disabled={!selectedId}
      title="Izmijeni"
      aria-label="Izmijeni"
    >
      <i className="bi bi-pencil" />
    </button>

    <button
      type="button"
      className="btn btn-outline-primary btn-sm"
      onClick={() => onManageEvents(selectedId)}
      disabled={!selectedId}
      title="Uredi događaje"
      aria-label="Uredi događaje"
    >
      <i className="bi bi-gear" />
    </button>


    <button
      type="button"
      className="btn btn-outline-danger btn-sm"
      onClick={onDelete}
      disabled={!selectedId}
      title="Obriši"
      aria-label="Obriši"
    >
      <i className="bi bi-trash" />
    </button>

    <button
      type="button"
      className="btn btn-success btn-sm"
      onClick={onAdd}
      title="Dodaj oblast"
      aria-label="Dodaj oblast"
    >
      <i className="bi bi-plus-lg" />
    </button>

  </div>
</div>



      {/* Table container */}
      <div className="border rounded flex-grow-1 bg-light p-2 d-flex flex-column">
        {/* Table */}
        <div className="flex-grow-1 rounded" style={{ overflow: "auto" }}>
          <table className="table table-sm table-hover align-middle mb-0 bg-white">
            <thead className="table-light position-sticky top-0" style={{ zIndex: 1 }}>
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
        <div className="d-flex justify-content-center mt-2">
          
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
  );
}
