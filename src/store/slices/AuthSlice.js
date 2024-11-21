import { createSlice } from "@reduxjs/toolkit";
import { signIn } from "../thunks/AuthThunk";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: {},
  },
  extraReducers: (builder) => {
    builder
      // Sign In
      .addCase(signIn.fulfilled, (state, action) => {
        console.log('cation', action.payload)
        state.currentUser = action.payload.userInfo;
        localStorage.setItem("token", action.payload.token);
      });
  },
});

export default userSlice.reducer;
