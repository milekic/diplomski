import { getUsersForTable } from "./adminApi";

export default function AdminUsersTable({ users = [] }) {
  const tableUsers = getUsersForTable(users);

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Korisničko ime</th>
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
  );
}
