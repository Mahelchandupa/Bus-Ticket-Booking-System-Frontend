import bus_ticket_booking_api from "../config/api";

export const fetchAllCities = async () => {
  try {
    const response = await bus_ticket_booking_api.get("/cities");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { message: "An unexpected error occurred" };
    }
  }
};

export const fetchSchedulesByParams = async (params) => {
  try {
    const response = await bus_ticket_booking_api.get(
      `/schedules?from=${params.from}&to=${params.to}&date=${params.date}`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { message: "An unexpected error occurred" };
    }
  }
};

export const fetchScheduleById = async (scheduleId) => {
  try {
    const response = await bus_ticket_booking_api.get(`/schedules/${scheduleId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { message: "An unexpected error occurred" };
    }
  }
}

export const processPayment = async (paymentData) => {
  try {
    const response = await bus_ticket_booking_api.post("/bookings", paymentData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { message: "An unexpected error occurred" };
    }
  }
}