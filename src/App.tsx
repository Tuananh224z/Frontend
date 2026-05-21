
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import Header from './components/layout/Header';
import Home from './pages/client/Home';
import Cart from './pages/Cart';
import Footer from './components/layout/Footer';
import Chatbot from './components/info/Chatbot';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* Header bao bọc trên cùng */}
          <Header />

          {/* Nội dung chính */}
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </div>

          {/* Trợ lý AI Chatbot lơ lửng */}
          <Chatbot />

          {/* Footer bao bọc dưới cùng */}
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}
