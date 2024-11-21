import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import bus_ticket_booking_api from "../../config/api";

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await bus_ticket_booking_api.post(`/auth/signin`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data); // Pass detailed error response
      }
      return rejectWithValue({
        error: { message: "An unexpected error occurred" },
      });
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await bus_ticket_booking_api.post(`/auth/signup`, {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data); // Pass detailed error response
      }
      return rejectWithValue({
        error: { message: "An unexpected error occurred" },
      });
    }
  }
);

// User Logout
export const userLogout = createAction("user/logout");