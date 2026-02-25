import { useEffect, useMemo, useState } from "react";
import AdminUserStats from "../features/admin/api/AdminUsersStats";
import AdminUsersTable from "../features/admin/api/AdminUsersTable";
import usePagination from "../shared/hooks/usePagination";
import { DEFAULT_PAGE_SIZE } from "../shared/constants/mapConstants";
import {
  ADMIN_STATUS_FILTER,
  ADMIN_STATUS_FILTER_OPTIONS,
  getAllUsers,
  getFilteredUsers,
  getNextSuspendedStatus,
  getUserStats,
  updateUserSuspensionInList,
  updateUserSuspensionStatus,
} from "../features/admin/api/adminApi";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(ADMIN_STATUS_FILTER.ALL);
  const [actionLoadingUserId, setActionLoadingUserId] = useState(null);
  const [actionError, setActionError] = useState("");

  const { totalUsers, activeUsers, suspendedUsers } = getUserStats(users);

  const filteredUsers = useMemo(() => {
    return getFilteredUsers(users, { searchTerm, statusFilter });
  }, [users, searchTerm, statusFilter]);

  const {
    currentPage,
    totalPages,
    pagedItems: pagedUsers,
    next,
    prev,
    setCurrentPage,
  } = usePagination(filteredUsers, DEFAULT_PAGE_SIZE);

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        const data = await getAllUsers();
        if (isMounted) {
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Greska pri ucitavanju korisnika:", error);
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleToggleSuspension = async (user) => {
    const userId = user?.id;
    if (userId == null) return;

    const nextIsSuspended = getNextSuspendedStatus(user);
    setActionError("");
    setActionLoadingUserId(userId);

    try {
      await updateUserSuspensionStatus(userId, nextIsSuspended);
      setUsers((prevUsers) => updateUserSuspensionInList(prevUsers, userId, nextIsSuspended));
    } catch (error) {
      setActionError("Nije moguce promijeniti status korisnika. Pokusaj ponovo.");
    } finally {
      setActionLoadingUserId(null);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      <div className="row flex-grow-1">
        <div className="col-12 p-4">
          

          <AdminUserStats
            totalUsers={totalUsers}
            activeUsers={activeUsers}
            suspendedUsers={suspendedUsers}
          />

          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Pretraži korisnike..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="col-md-3">
              <select className="form-select" value={statusFilter} onChange={handleStatusFilterChange}>
                {ADMIN_STATUS_FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {actionError ? (
            <div className="alert alert-danger py-2" role="alert">
              {actionError}
            </div>
          ) : null}

          <AdminUsersTable
            users={pagedUsers}
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={prev}
            onNext={next}
            onGoToPage={setCurrentPage}
            actionLoadingUserId={actionLoadingUserId}
            onToggleSuspension={handleToggleSuspension}
          />
        </div>
      </div>
    </div>
  );
}
