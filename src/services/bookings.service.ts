import BaseService from './base.service';
import { API_ENDPOINTS } from '../config/api.config';
import {
  Booking,
  CreateBookingRequest,
  PaginatedResponse,
} from '../types/api.types';

class BookingsService extends BaseService {
  // Create a new booking
  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    return this.post<Booking>(API_ENDPOINTS.BOOKINGS.BASE, data);
  }

  // Get a single booking by ID
  async getBookingById(id: number): Promise<Booking> {
    return this.get<Booking>(API_ENDPOINTS.BOOKINGS.BY_ID(id));
  }

  // Get current user's bookings (as guest or host)
  async getMyBookings(params?: {
    role?: 'guest' | 'host';
    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Booking>> {
    return this.get<PaginatedResponse<Booking>>(API_ENDPOINTS.BOOKINGS.MY_BOOKINGS, {
      params,
    });
  }

  // Get bookings for a specific listing
  async getListingBookings(
    listingId: number,
    params?: {
      status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
      page?: number;
      limit?: number;
    }
  ): Promise<PaginatedResponse<Booking>> {
    return this.get<PaginatedResponse<Booking>>(API_ENDPOINTS.BOOKINGS.BY_LISTING(listingId), {
      params,
    });
  }

  // Cancel a booking
  async cancelBooking(id: number, reason?: string): Promise<Booking> {
    return this.post<Booking>(API_ENDPOINTS.BOOKINGS.CANCEL(id), {
      reason,
    });
  }

  // Confirm a booking (host action)
  async confirmBooking(id: number): Promise<Booking> {
    return this.patch<Booking>(`${API_ENDPOINTS.BOOKINGS.BY_ID(id)}/confirm`);
  }

  // Decline a booking (host action)
  async declineBooking(id: number, reason?: string): Promise<Booking> {
    return this.patch<Booking>(`${API_ENDPOINTS.BOOKINGS.BY_ID(id)}/decline`, {
      reason,
    });
  }

  // Complete a booking (mark as completed after the event)
  async completeBooking(id: number): Promise<Booking> {
    return this.patch<Booking>(`${API_ENDPOINTS.BOOKINGS.BY_ID(id)}/complete`);
  }

  // Get booking statistics for current user
  async getBookingStats(): Promise<{
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    upcomingBookings: number;
  }> {
    return this.get(`${API_ENDPOINTS.BOOKINGS.BASE}/stats`);
  }

  // Get upcoming bookings for current user
  async getUpcomingBookings(params?: {
    role?: 'guest' | 'host';
    limit?: number;
  }): Promise<Booking[]> {
    return this.get<Booking[]>(`${API_ENDPOINTS.BOOKINGS.BASE}/upcoming`, {
      params,
    });
  }

  // Check if user can book a listing (based on verification status, etc.)
  async checkBookingEligibility(listingId: number): Promise<{
    eligible: boolean;
    reason?: string;
  }> {
    return this.get(`${API_ENDPOINTS.BOOKINGS.BASE}/check-eligibility/${listingId}`);
  }

  // Calculate booking price
  async calculatePrice(data: {
    listingId: number;
    date: string;
    startTime: string;
    endTime: string;
    guestsCount: number;
  }): Promise<{
    basePrice: number;
    serviceFee: number;
    totalPrice: number;
    hours: number;
  }> {
    return this.post(`${API_ENDPOINTS.BOOKINGS.BASE}/calculate-price`, data);
  }
}

export const bookingsService = new BookingsService();
export default bookingsService;