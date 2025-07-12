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
  role?: 'filmmaker' | 'location_owner' | 'both';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// User types
export interface User {
  id: number;
  name?: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'filmmaker' | 'location_owner' | 'both' | 'admin';
  bio?: string;
  location?: string;
  verified: boolean;
  verificationStatus: 'none' | 'pending' | 'verified';
  createdAt: string;
}

// Filming Location types
export type LocationType = 'urban' | 'nature' | 'industrial' | 'historical' | 'modern' | 'abandoned' | 'rooftop' | 'underground' | 'water' | 'architectural' | 'minimalist' | 'vintage';

export type ShootingType = 'photo' | 'video' | 'cinema' | 'commercial' | 'fashion' | 'music_video' | 'documentary';

export type NoiseLevel = 'quiet' | 'moderate' | 'noisy';

export interface TimeRestrictions {
  day: boolean;
  night: boolean;
  weekend: boolean;
}

export interface EquipmentAllowed {
  professional_camera: boolean;
  lighting: boolean;
  drone: boolean;
  heavy_equipment: boolean;
}

export interface Listing {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string; // legacy field
  locationType: LocationType;
  shootingTypes: ShootingType[];
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  area: number;
  maxGuests: number; // legacy field
  capacityPeople: number; // максимальная команда
  teamSize?: number; // alias for capacityPeople
  pricePerHour: number;
  pricePerDay?: number;
  amenities: string[];
  rules?: string;
  
  // Новые поля для съемочных локаций
  timeRestrictions: TimeRestrictions;
  equipmentAllowed: EquipmentAllowed;
  parkingSpaces: number;
  powerOutlets: boolean;
  wifiAvailable: boolean;
  changingRoom: boolean;
  cateringSpace: boolean;
  noiseLevel: NoiseLevel;
  weatherDependent: boolean;
  permitsRequired: boolean;
  securityDeposit: number;
  insuranceRequired: boolean;
  minBookingHours: number;
  maxBookingHours: number;
  setupTimeMinutes: number;
  cleanupTimeMinutes: number;
  
  // Дополнительные поля для съемочных локаций
  allowedShootingTypes?: ShootingType[];
  allowedEquipment?: string[];
  hasElectricity?: boolean;
  hasWifi?: boolean;
  hasParking?: boolean;
  hasDressingRoom?: boolean;
  hasCatering?: boolean;
  isWeatherDependent?: boolean;
  requiresPermit?: boolean;
  requiresInsurance?: boolean;
  additionalServices?: string;
  
  status: 'active' | 'paused' | 'deleted';
  images: ListingImage[];
  user?: User;
  owner?: User; // владелец локации (бывший host)
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
  locationType: LocationType;
  shootingTypes: ShootingType[];
  address: string;
  city: string;
  area: number;
  capacityPeople: number;
  pricePerHour: number;
  pricePerDay?: number;
  amenities: string[];
  rules?: string;
  
  // Новые поля для съемочных локаций
  timeRestrictions: TimeRestrictions;
  equipmentAllowed: EquipmentAllowed;
  parkingSpaces: number;
  powerOutlets: boolean;
  wifiAvailable: boolean;
  changingRoom: boolean;
  cateringSpace: boolean;
  noiseLevel: NoiseLevel;
  weatherDependent: boolean;
  permitsRequired: boolean;
  securityDeposit: number;
  insuranceRequired: boolean;
  minBookingHours: number;
  maxBookingHours: number;
  setupTimeMinutes: number;
  cleanupTimeMinutes: number;
}

// Shooting Booking types
export interface Booking {
  id: number;
  listingId: number;
  filmakerId: number; // бывший guestId
  locationOwnerId: number; // бывший hostId
  date: string;
  startTime: string;
  endTime: string;
  teamSize: number; // бывший guestsCount
  shootingType: ShootingType;
  equipmentDescription?: string;
  totalPrice: number;
  serviceFee: number;
  securityDeposit?: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  cancelledBy?: number;
  cancellationReason?: string;
  filmmakerMessage?: string; // бывший guestMessage
  listing?: Listing;
  filmmaker?: User; // бывший guest
  locationOwner?: User; // бывший host
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  listingId: number;
  date: string;
  startTime: string;
  endTime: string;
  teamSize: number;
  shootingType: ShootingType | string;
  equipmentDescription?: string;
  filmmakerMessage?: string;
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
  reviewerType: 'filmmaker' | 'location_owner';
  reviewer?: User;
  createdAt: string;
}

// Shooting Review types (более детальные отзывы о съемках)
export interface ShootingReview {
  id: number;
  listingId: number;
  userId: number;
  bookingId?: number;
  shootingType: ShootingType;
  ratingLocation: number; // оценка локации
  ratingFacilities: number; // оценка удобств
  ratingOwner: number; // оценка владельца
  equipmentUsed: string[]; // использованное оборудование
  teamSize: number;
  reviewText: string;
  photos?: string[]; // фото с съемки (если разрешено)
  wouldBookAgain: boolean;
  createdAt: string;
  updatedAt: string;
}

// Saved Locations (вишлист)
export interface SavedLocation {
  id: number;
  userId: number;
  listingId: number;
  savedFor: ShootingType | 'other';
  notes?: string;
  listing?: Listing;
  createdAt: string;
}

// Search/Filter types for Filming Locations
export interface LocationFilters {
  locationType?: LocationType;
  shootingTypes?: ShootingType[];
  city?: string;
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  teamSizeMin?: number;
  teamSizeMax?: number;
  amenities?: string[];
  date?: string;
  startTime?: string;
  endTime?: string;
  
  // Специфичные фильтры для съемок
  powerOutlets?: boolean;
  wifiAvailable?: boolean;
  changingRoom?: boolean;
  cateringSpace?: boolean;
  parkingRequired?: boolean;
  noiseLevel?: NoiseLevel[];
  weatherDependent?: boolean;
  permitsRequired?: boolean;
  insuranceRequired?: boolean;
  minBookingHours?: number;
  maxBookingHours?: number;
  
  // Фильтры по времени
  dayShootingAllowed?: boolean;
  nightShootingAllowed?: boolean;
  weekendShootingAllowed?: boolean;
  
  // Фильтры по оборудованию
  professionalCameraAllowed?: boolean;
  lightingAllowed?: boolean;
  droneAllowed?: boolean;
}

// Backward compatibility
export interface ListingFilters extends LocationFilters {
  category?: string;
  guestsCount?: number;
}

export interface SearchParams extends ListingFilters {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  // Additional filtering fields
  allowedShootingTypes?: ShootingType[] | string[];
  allowedEquipment?: string[];
  hasElectricity?: boolean;
  hasWifi?: boolean;
  hasParking?: boolean;
  hasDressingRoom?: boolean;
  hasCatering?: boolean;
  isWeatherDependent?: boolean;
  requiresPermit?: boolean;
  requiresInsurance?: boolean;
  teamSizeMin?: number;
  teamSizeMax?: number;
}