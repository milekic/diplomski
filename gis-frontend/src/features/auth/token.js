import { jwtDecode } from "jwt-decode";

const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

  
export function decodeToken(token) {
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null; 
  }
}

//vraca username, role i citav dekodiran token
export function getUserFromToken(token) {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  const rawRole = decoded.role ?? decoded[ROLE_CLAIM];
  const role = Array.isArray(rawRole) ? rawRole[0] : rawRole;

  const username = decoded.unique_name ?? decoded.name ?? decoded.sub;

  return { username, role, decoded };
}

export function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return false; 

  
  return decoded.exp * 1000 < Date.now();
}
