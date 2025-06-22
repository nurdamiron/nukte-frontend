import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/home/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ListingsPage } from './pages/guest/ListingsPage';
import { ListingDetailPage } from './pages/guest/ListingDetailPage';
import { CreateListingPage } from './pages/host/CreateListingPage';
import { MyListingsPage } from './pages/host/MyListingsPage';
import { BookingsPage } from './pages/booking/BookingsPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { ChatPage } from './pages/booking/ChatPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="listings" element={<ListingsPage />} />
        <Route path="listings/:id" element={<ListingDetailPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="host/listings" element={<MyListingsPage />} />
          <Route path="host/listings/create" element={<CreateListingPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="bookings/:id/chat" element={<ChatPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default Router;