import api from './api';

export interface Booking {
  id: number;
  listing_id: number;
  guest_id: number;
  host_id: number;
  date: string;
  start_time: string;
  end_time: string;
  guests_count: number;
  total_price: number;
  service_fee: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guest_message?: string;
  cancellation_reason?: string;
  listing_title?: string;
  listing_location?: string;
  listing_image?: string;
  host_name?: string;
  host_avatar?: string;
  guest_name?: string;
  guest_avatar?: string;
  created_at?: string;
}

export interface CreateBookingData {
  listingId: number;
  date: string;
  startTime: string;
  endTime: string;
  guestsCount: number;
  message?: string;
}

export interface Message {
  id: number;
  booking_id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  file_url?: string;
  file_name?: string;
  file_size?: string;
  is_read: boolean;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
}

class BookingService {
  async getBookings(params?: { role?: string; status?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);

    const response = await api.get(`/bookings?${queryParams.toString()}`);
    return response.data.data.bookings;
  }

  async getBookingById(id: number) {
    const response = await api.get(`/bookings/${id}`);
    return response.data.data.booking;
  }

  async createBooking(data: CreateBookingData) {
    const response = await api.post('/bookings', data);
    return response.data.data;
  }

  async updateBookingStatus(id: number, status: 'confirmed' | 'cancelled', reason?: string) {
    const response = await api.patch(`/bookings/${id}/status`, { status, reason });
    return response.data;
  }

  async getBookingMessages(bookingId: number) {
    const response = await api.get(`/bookings/${bookingId}/messages`);
    return response.data.data.messages;
  }

  async sendMessage(bookingId: number, message: string) {
    const response = await api.post(`/bookings/${bookingId}/messages`, { message });
    return response.data.data;
  }
}

export default new BookingService();