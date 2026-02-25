import apiClient from "../../../shared/api/apiClient";

export const getAllUsers = async () => {
  const response = await apiClient.get("/users/role/user");
  return response.data;
};

const toUsersArray = (users) => (Array.isArray(users) ? users : []);

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

export const getUsersForTable = (users) => {
  return toUsersArray(users).map((user) => {
    const primaryAction = getPrimaryActionForUser(user);

    return {
      id: user?.id,
      username: user?.username ?? user?.userName ?? "",
      email: user?.email ?? "",
      statusLabel: getUserStatusLabel(user),
      primaryActionLabel: primaryAction.label,
      primaryActionClassName: primaryAction.className,
    };
  });
};
