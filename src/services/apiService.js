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
