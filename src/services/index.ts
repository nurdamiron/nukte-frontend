export { default as authService } from './auth.service';
export { default as listingsService } from './listings.service';
export { default as bookingsService } from './bookings.service';
export { default as messagesService } from './messages.service';
export { default as reviewService } from './review.service';

// Re-export types that are commonly used with services
export type {
  // Auth types
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  
  // Listing types
  Listing,
  ListingImage,
  CreateListingRequest,
  ListingFilters,
  SearchParams,
  
  // Booking types
  Booking,
  CreateBookingRequest,
  
  // Message types
  Message,
  Conversation,
  
  // Review types
  Review,
  
  // Common types
  ApiResponse,
  ApiError,
  PaginatedResponse,
} from '../types/api.types';