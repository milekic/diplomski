import { createSlice } from "@reduxjs/toolkit";
import { getUserFromToken, isTokenExpired } from "./token";

//ovo je redux slice za rad sa autentifikacijom

// Inicijalno stanje se puni iz tokena
function buildInitialAuthState() {
  const token = localStorage.getItem("token");
  if (!token) {
    return { token: null, username: null, role: null, isAuthenticated: false };
  }

  if (isTokenExpired(token)) {
    localStorage.removeItem("token");
    return { token: null, username: null, role: null, isAuthenticated: false };
  }

  const user = getUserFromToken(token);
  return {
    token,
    username: user?.username ?? null,
    role: user?.role ?? null,
    isAuthenticated: true,
  };
}

const initialState = buildInitialAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token } = action.payload;

      state.token = token;
      state.isAuthenticated = true;

      const user = getUserFromToken(token);
      state.username = user?.username ?? null;
      state.role = user?.role ?? null;

      // samo token ide u localStorage
      localStorage.setItem("token", token);
    },

    clearAuth: (state) => {
      state.token = null;
      state.username = null;
      state.role = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;
