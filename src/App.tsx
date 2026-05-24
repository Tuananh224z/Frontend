import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Home from './pages/client/Home';
import Cart from './pages/client/Cart';
import Checkout from './pages/client/Checkout';
import CheckoutSuccess from './pages/client/CheckoutSuccess';
import CheckoutFailure from './pages/client/CheckoutFailure';
import ProductDetail from './pages/client/ProductDetail';
import AllProducts from './pages/client/AllProducts';
import Footer from './components/layout/Footer';
import Chatbot from './components/ChatbotWidget';
import ScrollToTop from './components/common/ScrollToTop';

// Client Auth & Account pages
import Login from './pages/client/Login';
import Register from './pages/client/Register';
import Profile from './pages/client/Profile';
import Addresses from './pages/client/Addresses';
import Orders from './pages/client/Orders';
import AccountLayout from './components/layout/AccountLayout';

// Admin page imports
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProduct from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBrand from './pages/admin/AdminBrands';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReviews from './pages/admin/AdminReviews';
import AdminChatbot from './pages/admin/AdminChatbot';
import AdminSettings from './pages/admin/AdminSettings';

import ErrorBoundary from './components/common/ErrorBoundary';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header only rendered for client pages */}
      {!isAdminRoute && <Header />}

      {/* Main Content Area */}
      <div className="flex-grow">
        <ErrorBoundary>
          <Routes>
            {/* Client Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/failure" element={<CheckoutFailure />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/products" element={<AllProducts />} />
            <Route path="/category/:categorySlug" element={<AllProducts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Client Protected Routes */}
            <Route element={<AccountLayout />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/orders" element={<Orders />} />
            </Route>

            {/* Admin Protected Dashboard Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProduct />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="brands" element={<AdminBrand />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="chatbot" element={<AdminChatbot />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </div>

      {/* Floatable Chatbot assistant and Footer only rendered for client pages */}
      {!isAdminRoute && <Chatbot />}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
