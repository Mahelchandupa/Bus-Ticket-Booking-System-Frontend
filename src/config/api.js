import axios from "axios";
import history from "../helpers/history";
import showToast from "../utils/toastNotifications";

const bus_ticket_booking_api = axios.create({
  baseURL: process.env.BUS_TICKET_BOOKING_API || "http://localhost:5000/api/v1",
  headers: {
    "Content-type": "application/json",
  },
});

// Use axios interceptors to include the token in all requests
bus_ticket_booking_api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("retrieving token", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

bus_ticket_booking_api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Token expired"
    ) {
      showToast("error", "Token expired. Please log in again.");
      localStorage.clear();
      history.push("/login");
    }
    return Promise.reject(error);
  }
);

export default bus_ticket_booking_api;