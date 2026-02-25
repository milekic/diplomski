import apiClient from "../../../shared/api/apiClient";

export const getAllUsers = async () => {
  const response = await apiClient.get("/users/role/user");
  return response.data;
};

export const updateUserSuspensionStatus = async (userId, isSuspended) => {
  const response = await apiClient.put(`/users/${userId}/suspension`, {
    isSuspended: Boolean(isSuspended),
  });
  return response.data;
};

const toUsersArray = (users) => (Array.isArray(users) ? users : []);
const normalizeText = (value) => String(value ?? "").trim().toLowerCase();
const toComparableId = (value) => String(value ?? "");

export const ADMIN_STATUS_FILTER = {
  ALL: "all",
  ACTIVE: "active",
  SUSPENDED: "suspended",
};

export const ADMIN_STATUS_FILTER_OPTIONS = [
  { value: ADMIN_STATUS_FILTER.ALL, label: "Svi statusi" },
  { value: ADMIN_STATUS_FILTER.ACTIVE, label: "Aktivni" },
  { value: ADMIN_STATUS_FILTER.SUSPENDED, label: "Suspendovani" },
];

const getUserSearchText = (user) => {
  const username = user?.username ?? user?.userName ?? "";
  const email = user?.email ?? "";
  return normalizeText(`${username} ${email}`);
};

const matchesStatusFilter = (user, statusFilter) => {
  if (statusFilter === ADMIN_STATUS_FILTER.ACTIVE) return !user?.isSuspended;
  if (statusFilter === ADMIN_STATUS_FILTER.SUSPENDED) return Boolean(user?.isSuspended);
  return true;
};

export const getFilteredUsers = (
  users,
  { searchTerm = "", statusFilter = ADMIN_STATUS_FILTER.ALL } = {}
) => {
  const normalizedSearchTerm = normalizeText(searchTerm);
  const normalizedStatusFilter = normalizeText(statusFilter);

  return toUsersArray(users).filter((user) => {
    if (!matchesStatusFilter(user, normalizedStatusFilter)) return false;
    if (!normalizedSearchTerm) return true;
    return getUserSearchText(user).includes(normalizedSearchTerm);
  });
};

export const getTotalUsersCount = (users) => {
  return toUsersArray(users).length;
};

export const getActiveUsersCount = (users) => {
  return toUsersArray(users).filter((user) => !user?.isSuspended).length;
};

export const getSuspendedUsersCount = (users) => {
  return toUsersArray(users).filter((user) => Boolean(user?.isSuspended)).length;
};

export const getUserStats = (users) => {
  return {
    totalUsers: getTotalUsersCount(users),
    activeUsers: getActiveUsersCount(users),
    suspendedUsers: getSuspendedUsersCount(users),
  };
};

export const getUserStatusLabel = (user) => {
  return user?.isSuspended ? "Suspendovan" : "Aktivan";
};

export const getPrimaryActionForUser = (user) => {
  if (user?.isSuspended) {
    return { label: "Aktiviraj", className: "btn-success" };
  }

  return { label: "Suspenduj", className: "btn-warning" };
};

export const getNextSuspendedStatus = (user) => {
  return !Boolean(user?.isSuspended);
};

export const updateUserSuspensionInList = (users, userId, isSuspended) => {
  return toUsersArray(users).map((user) => {
    if (toComparableId(user?.id) !== toComparableId(userId)) return user;
    return { ...user, isSuspended: Boolean(isSuspended) };
  });
};

export const getUsersForTable = (users) => {
  return toUsersArray(users).map((user) => {
    const primaryAction = getPrimaryActionForUser(user);

    return {
      id: user?.id,
      username: user?.username ?? user?.userName ?? "",
      email: user?.email ?? "",
      isSuspended: Boolean(user?.isSuspended),
      statusLabel: getUserStatusLabel(user),
      primaryActionLabel: primaryAction.label,
      primaryActionClassName: primaryAction.className,
    };
  });
};

export const getPaginationPages = (totalPages) => {
  const safeTotalPages = Math.max(1, Number(totalPages) || 1);
  return Array.from({ length: safeTotalPages }, (_, index) => index + 1);
};
