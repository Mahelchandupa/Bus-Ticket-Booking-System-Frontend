import io from "socket.io-client";

const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BUS_TICKET_BOOKING_API_PROD_WS
    : process.env.REACT_APP_BUS_TICKET_BOOKING_API_DEV_WS;

const socket = io(baseURL, {
  transports: ["websocket"],
  reconnection: true,
});

export default socket;
