import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

//kreiranje redux store-a
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
