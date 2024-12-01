import axios from "axios";

console.log(process.env.BUS_TICKET_BOOKING_API_PROD);
console.log(process.env.NODE_ENV);

const baseURL = process.env.NODE_ENV === "production"
  ? process.env.REACT_APP_BUS_TICKET_BOOKING_API_PROD
  : process.env.REACT_APP_BUS_TICKET_BOOKING_API_DEV;


const bus_ticket_booking_api = axios.create({
  baseURL,
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

export default bus_ticket_booking_api;