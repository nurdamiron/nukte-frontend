import api from './api';

export interface Listing {
  id: number;
  title: string;
  description: string;
  category: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  area: number;
  max_guests: number;
  price_per_hour: number;
  price_per_day?: number;
  amenities: string[];
  rules?: string;
  status: string;
  images: string[];
  average_rating: number;
  total_reviews: number;
  host_name?: string;
  host_avatar?: string;
  host_id?: number;
  created_at?: string;
}

export interface ListingFilters {
  city?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  amenities?: string;
  page?: number;
  limit?: number;
}

export interface CreateListingData {
  title: string;
  description: string;
  category: string;
  address: string;
  city: string;
  area: number;
  maxGuests: number;
  pricePerHour: number;
  pricePerDay?: number;
  amenities?: string[];
  rules?: string;
  latitude?: number;
  longitude?: number;
}

class ListingService {
  async getListings(filters?: ListingFilters) {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/listings?${params.toString()}`);
    return response.data.data;
  }

  async getListingById(id: number) {
    const response = await api.get(`/listings/${id}`);
    return response.data.data.listing;
  }

  async getUserListings(userId: number) {
    const response = await api.get(`/listings/user/${userId}`);
    return response.data.data.listings;
  }

  async createListing(data: CreateListingData) {
    const response = await api.post('/listings', data);
    return response.data.data;
  }

  async updateListing(id: number, data: Partial<CreateListingData>) {
    const response = await api.put(`/listings/${id}`, data);
    return response.data.data;
  }

  async deleteListing(id: number) {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
  }

  async uploadImages(listingId: number, files: File[]) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await api.post(`/listings/${listingId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data.images;
  }
}

export default new ListingService();