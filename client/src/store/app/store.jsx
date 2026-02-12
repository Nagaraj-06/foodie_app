import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "../features/filter/filterSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    auth: authReducer,
  },
});
