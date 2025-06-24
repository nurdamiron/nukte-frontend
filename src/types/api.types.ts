// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'guest' | 'host' | 'both';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// User types
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'guest' | 'host' | 'both' | 'admin';
  bio?: string;
  location?: string;
  verified: boolean;
  verificationStatus: 'none' | 'pending' | 'verified';
  createdAt: string;
}

// Listing types
export interface Listing {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  area: number;
  maxGuests: number;
  pricePerHour: number;
  pricePerDay?: number;
  amenities: string[];
  rules?: string;
  status: 'active' | 'paused' | 'deleted';
  images: ListingImage[];
  user?: User;
  host?: User;
  rating?: number;
  reviewsCount?: number;
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface ListingImage {
  id: number;
  listingId: number;
  url: string;
  isPrimary: boolean;
  orderIndex: number;
}

export interface CreateListingRequest {
  title: string;
  description: string;
  category: string;
  address: string;
  city: string;
  area: number;
  maxGuests: number;
  pricePerHour: number;
  pricePerDay?: number;
  amenities: string[];
  rules?: string;
}

// Booking types
export interface Booking {
  id: number;
  listingId: number;
  guestId: number;
  hostId: number;
  date: string;
  startTime: string;
  endTime: string;
  guestsCount: number;
  totalPrice: number;
  serviceFee: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  cancelledBy?: number;
  cancellationReason?: string;
  guestMessage?: string;
  listing?: Listing;
  guest?: User;
  host?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  listingId: number;
  date: string;
  startTime: string;
  endTime: string;
  guestsCount: number;
  guestMessage?: string;
}

// Alias for backward compatibility
export type BookingCreateData = CreateBookingRequest;

// Message types
export interface Message {
  id: number;
  bookingId: number;
  senderId: number;
  receiverId: number;
  message: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  isRead: boolean;
  sender?: User;
  receiver?: User;
  createdAt: string;
}

export interface Conversation {
  booking: Booking;
  lastMessage?: Message;
  unreadCount: number;
  otherUser: User;
}

// Review types
export interface Review {
  id: number;
  listingId: number;
  bookingId: number;
  reviewerId: number;
  reviewedId: number;
  rating: number;
  comment?: string;
  reviewerType: 'guest' | 'host';
  reviewer?: User;
  createdAt: string;
}

// Search/Filter types
export interface ListingFilters {
  category?: string;
  city?: string;
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  amenities?: string[];
  date?: string;
  startTime?: string;
  endTime?: string;
  guestsCount?: number;
}

export interface SearchParams extends ListingFilters {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}