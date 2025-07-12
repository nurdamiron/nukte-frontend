export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/profile/password',
    REFRESH_TOKEN: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    SEND_VERIFICATION: '/auth/send-verification',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  LISTINGS: {
    BASE: '/listings',
    BY_ID: (id: number) => `/listings/${id}`,
    SEARCH: '/listings/search',
    BY_USER: '/listings/user',
    UPLOAD_IMAGES: (listingId: number) => `/listings/${listingId}/images`,
  },
  BOOKINGS: {
    BASE: '/bookings',
    BY_ID: (id: number) => `/bookings/${id}`,
    MY_BOOKINGS: '/bookings/me',
    BY_LISTING: (listingId: number) => `/bookings/listing/${listingId}`,
    CANCEL: (id: number) => `/bookings/${id}/cancel`,
  },
  MESSAGES: {
    CONVERSATIONS: '/messages/conversations',
    BY_BOOKING: (bookingId: number) => `/messages/booking/${bookingId}`,
    SEND: '/messages',
    MARK_READ: (messageId: number) => `/messages/read/${messageId}`,
  },
  REVIEWS: {
    BASE: '/reviews',
    BY_ID: (id: number) => `/reviews/${id}`,
    LISTING: (listingId: number) => `/reviews/listing/${listingId}`,
    USER: (userId: number) => `/reviews/user/${userId}`,
  },
  UPLOAD: {
    IMAGE: '/upload/image',
  },
};