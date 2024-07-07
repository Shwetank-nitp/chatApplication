import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  data: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, actions) => {
      state.status = true;
      state.data = actions.payload;
    },
    logout: (state) => {
      (state.status = false), (state.data = {});
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
