import BaseService from './base.service';
import { API_ENDPOINTS } from '../config/api.config';
import {
  Review,
  PaginatedResponse,
} from '../types/api.types';

class ReviewService extends BaseService {
  async createReview(data: { bookingId: number; rating: number; comment?: string }): Promise<Review> {
    return this.post<Review>(API_ENDPOINTS.REVIEWS.BASE, data);
  }

  async getListingReviews(listingId: number, params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Review>> {
    return this.get<PaginatedResponse<Review>>(API_ENDPOINTS.REVIEWS.LISTING(listingId), { params });
  }

  async getUserReviews(userId: number, params?: { type?: 'received' | 'given'; page?: number; limit?: number }): Promise<PaginatedResponse<Review>> {
    return this.get<PaginatedResponse<Review>>(API_ENDPOINTS.REVIEWS.USER(userId), { params });
  }

  async updateReview(id: number, data: { rating?: number; comment?: string }): Promise<Review> {
    return this.put<Review>(API_ENDPOINTS.REVIEWS.BY_ID(id), data);
  }

  async deleteReview(id: number): Promise<void> {
    return this.delete<void>(API_ENDPOINTS.REVIEWS.BY_ID(id));
  }
}

export const reviewService = new ReviewService();
export default reviewService;