import { createSlice } from "@reduxjs/toolkit";
import { signIn, signUp, userLogout } from "../thunks/AuthThunk";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: {},
  },
  extraReducers: (builder) => {
    builder
      // Sign In
      .addCase(signIn.fulfilled, (state, action) => {
        state.currentUser = action.payload.userInfo;
        localStorage.setItem("token", action.payload.token);
      })
      // Sign Up
      .addCase(signUp.fulfilled, (state, action) => {
        console.log("action", action.payload);
      })
      // User Logout
      .addCase(userLogout, (state) => {
        state.currentUser = {};
        localStorage.removeItem("token");
      });
  },
});

export default userSlice.reducer;
