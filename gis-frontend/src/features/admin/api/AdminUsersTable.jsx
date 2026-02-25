import { getPaginationPages, getUsersForTable } from "./adminApi";

export default function AdminUsersTable({
  users = [],
  currentPage = 1,
  totalPages = 1,
  onPrev = () => {},
  onNext = () => {},
  onGoToPage = () => {},
}) {
  const tableUsers = getUsersForTable(users);
  const pages = getPaginationPages(totalPages);

  return (
    <div className="d-flex flex-column">
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Korisnicko ime</th>
              <th>Email</th>
              <th>Status</th>
              <th>Akcije</th>
            </tr>
          </thead>

          <tbody>
            {tableUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-muted">
                  Nema korisnika za prikaz.
                </td>
              </tr>
            ) : (
              tableUsers.map((user) => (
                <tr key={user.id ?? `${user.username}-${user.email}`}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.statusLabel}</td>
                  <td>
                    <button className={`btn btn-sm me-1 ${user.primaryActionClassName}`} type="button">
                      {user.primaryActionLabel}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center mt-2">
        <nav aria-label="Admin users pagination">
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button type="button" className="page-link" onClick={onPrev} disabled={currentPage === 1}>
                Prethodna
              </button>
            </li>

            {pages.map((page) => (
              <li key={page} className={`page-item ${page === currentPage ? "active" : ""}`}>
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

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                type="button"
                className="page-link"
                onClick={onNext}
                disabled={currentPage === totalPages}
              >
                Sljedeca
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
