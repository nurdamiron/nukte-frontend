import BaseService from './base.service';
import { API_ENDPOINTS } from '../config/api.config';
import {
  Listing,
  CreateListingRequest,
  ListingFilters,
  SearchParams,
  PaginatedResponse,
} from '../types/api.types';

class ListingsService extends BaseService {
  // Get all listings with pagination and filtering
  async getListings(params?: SearchParams): Promise<PaginatedResponse<Listing>> {
    return this.get<PaginatedResponse<Listing>>(API_ENDPOINTS.LISTINGS.BASE, {
      params,
    });
  }

  // Get a single listing by ID
  async getListingById(id: number): Promise<Listing> {
    return this.get<Listing>(API_ENDPOINTS.LISTINGS.BY_ID(id));
  }

  // Search listings with filters
  async searchListings(params: SearchParams): Promise<PaginatedResponse<Listing>> {
    return this.get<PaginatedResponse<Listing>>(API_ENDPOINTS.LISTINGS.SEARCH, {
      params,
    });
  }

  // Get listings by current user
  async getUserListings(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Listing>> {
    return this.get<PaginatedResponse<Listing>>(API_ENDPOINTS.LISTINGS.BY_USER, {
      params,
    });
  }

  // Create a new listing
  async createListing(data: CreateListingRequest): Promise<Listing> {
    return this.post<Listing>(API_ENDPOINTS.LISTINGS.BASE, data);
  }

  // Update a listing
  async updateListing(id: number, data: Partial<CreateListingRequest>): Promise<Listing> {
    return this.put<Listing>(API_ENDPOINTS.LISTINGS.BY_ID(id), data);
  }

  // Delete a listing (soft delete - changes status to 'deleted')
  async deleteListing(id: number): Promise<void> {
    return this.delete<void>(API_ENDPOINTS.LISTINGS.BY_ID(id));
  }

  // Toggle listing status (active/paused)
  async toggleListingStatus(id: number): Promise<Listing> {
    return this.patch<Listing>(`${API_ENDPOINTS.LISTINGS.BY_ID(id)}/toggle-status`);
  }

  // Upload images for a listing
  async uploadImages(listingId: number, files: File[]): Promise<Listing> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('images', file);
    });

    return this.post<Listing>(API_ENDPOINTS.LISTINGS.UPLOAD_IMAGES(listingId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Delete a listing image
  async deleteImage(listingId: number, imageId: number): Promise<Listing> {
    return this.delete<Listing>(`${API_ENDPOINTS.LISTINGS.BY_ID(listingId)}/images/${imageId}`);
  }

  // Set primary image for a listing
  async setPrimaryImage(listingId: number, imageId: number): Promise<Listing> {
    return this.patch<Listing>(`${API_ENDPOINTS.LISTINGS.BY_ID(listingId)}/images/${imageId}/primary`);
  }

  // Get available dates for a listing
  async getAvailableDates(listingId: number, month: string): Promise<{ dates: string[] }> {
    return this.get<{ dates: string[] }>(`${API_ENDPOINTS.LISTINGS.BY_ID(listingId)}/availability`, {
      params: { month },
    });
  }

  // Check availability for specific date and time
  async checkAvailability(
    listingId: number,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<{ available: boolean }> {
    return this.post<{ available: boolean }>(`${API_ENDPOINTS.LISTINGS.BY_ID(listingId)}/check-availability`, {
      date,
      startTime,
      endTime,
    });
  }
}

export const listingsService = new ListingsService();
export default listingsService;