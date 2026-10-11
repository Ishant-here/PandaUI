import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    allUsers: [],
    allComponents: [],
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setAllUser: (state, action) => {
      state.allUsers = action.payload;
    },
    setAllComponents: (state, action) => {
      state.allComponents = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
      state.allUsers = [];
      state.allComponents = [];
    },
  },
});

export const {
  setUserData,
  setAllUser,
  setAllComponents,
  clearUserData,
} = userSlice.actions;

export default userSlice.reducer;