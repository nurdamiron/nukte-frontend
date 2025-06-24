export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/profile',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    SEND_VERIFICATION: '/auth/send-verification',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  
  // Listings endpoints
  LISTINGS: {
    BASE: '/listings',
    BY_ID: (id: number) => `/listings/${id}`,
    SEARCH: '/listings/search',
    BY_USER: '/listings/user',
    UPLOAD_IMAGES: (id: number) => `/listings/${id}/images`,
  },
  
  // Bookings endpoints
  BOOKINGS: {
    BASE: '/bookings',
    BY_ID: (id: number) => `/bookings/${id}`,
    MY_BOOKINGS: '/bookings/my',
    BY_LISTING: (listingId: number) => `/bookings/listing/${listingId}`,
    CANCEL: (id: number) => `/bookings/${id}/cancel`,
  },
  
  // Messages endpoints
  MESSAGES: {
    CONVERSATIONS: '/messages/conversations',
    BY_BOOKING: (bookingId: number) => `/messages/booking/${bookingId}`,
    SEND: '/messages/send',
    MARK_READ: (id: number) => `/messages/${id}/read`,
  },
  
  // Reviews endpoints
  REVIEWS: {
    BY_LISTING: (listingId: number) => `/reviews/listing/${listingId}`,
    CREATE: '/reviews',
    BY_USER: (userId: number) => `/reviews/user/${userId}`,
  },
  
  // Upload endpoints
  UPLOAD: {
    IMAGE: '/upload/image',
    IMAGES: '/upload/images',
    AVATAR: '/upload/avatar',
  },
};