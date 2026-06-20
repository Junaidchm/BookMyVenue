import apiClient from "./api-client";

export const bookingService = {
  /**
   * Fetch all bookings for the current user
   */
  getBookings: async (params?: Record<string, any>) => {
    const response = await apiClient.get("/bookings", { params });
    return response.data;
  },

  /**
   * Fetch booking details by ID
   */
  getBookingById: async (id: string) => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },

  /**
   * Create a new booking
   */
  createBooking: async (payload: Record<string, any>) => {
    const response = await apiClient.post("/bookings", payload);
    return response.data;
  },

  /**
   * Cancel or delete a booking
   */
  cancelBooking: async (id: string) => {
    const response = await apiClient.delete(`/bookings/${id}`);
    return response.data;
  },
};

export default bookingService;
