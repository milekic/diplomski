import { useEffect, useState } from "react";
import AdminUserStats from "../features/admin/api/AdminUsersStats";
import AdminUsersTable from "../features/admin/api/AdminUsersTable";
import { getAllUsers, getUserStats } from "../features/admin/api/adminApi";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const { totalUsers, activeUsers, suspendedUsers } = getUserStats(users);

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        const data = await getAllUsers();
        if (isMounted) {
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Greška pri učitavanju korisnika:", error);
        if (isMounted) {
          setUsers([]);
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      {/* ===== MAIN CONTENT ===== */}
      <div className="row flex-grow-1">
        {/* ===== MAIN ADMIN AREA ===== */}
        <div className="col-12 p-4">
          <h5 className="mb-4">Upravljanje korisnicima</h5>

          <AdminUserStats
            totalUsers={totalUsers}
            activeUsers={activeUsers}
            suspendedUsers={suspendedUsers}
          />

          {/* ===== SEARCH + FILTER ===== */}
          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Pretraži korisnike..."
              />
            </div>

            <div className="col-md-3">
              <select className="form-select">
                <option>Svi statusi</option>
                <option>Aktivni</option>
                <option>Suspendovani</option>
              </select>
            </div>
          </div>

          {/* ===== USERS TABLE ===== */}
          <AdminUsersTable users={users} />
        </div>
      </div>
    </div>
  );
}
