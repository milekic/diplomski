import apiClient from "../../../shared/api/apiClient";
import { decodeToken } from "../../auth/token";

const NAME_IDENTIFIER_CLAIM =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

const toComparableId = (value) => String(value ?? "");
const normalizeText = (value) => String(value ?? "").trim().toLowerCase();

const getUserIdFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  const rawId = decoded.sub ?? decoded.nameid ?? decoded[NAME_IDENTIFIER_CLAIM];
  const numericId = Number(rawId);
  return Number.isFinite(numericId) ? numericId : null;
};

export const getCurrentUserProfile = async ({ token, username } = {}) => {
  const response = await apiClient.get("/users");
  const users = Array.isArray(response.data) ? response.data : [];

  const tokenUserId = getUserIdFromToken(token);
  const normalizedUsername = normalizeText(username);

  const currentUser =
    users.find((user) => toComparableId(user?.id) === toComparableId(tokenUserId)) ??
    users.find((user) => normalizeText(user?.username ?? user?.userName) === normalizedUsername);

  if (!currentUser) return null;

  return {
    id: currentUser?.id ?? null,
    userName: currentUser?.username ?? currentUser?.userName ?? "",
    email: currentUser?.email ?? "",
  };
};

