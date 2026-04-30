import { useState, useEffect } from 'react';
import { ArrowUp, Phone } from 'lucide-react';
import ChatWidget from '../common/ChatWidget';

const FloatingWidgets = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className={`w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-700 transition-all duration-300 relative group ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
        <span className="absolute right-full mr-4 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Lên đầu trang
        </span>
      </button>

      {/* Zalo */}
      <a 
        href="#" 
        className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform relative group"
        aria-label="Zalo"
      >
        <img src="/zalo.png" alt="Zalo" className="w-12 h-12 object-contain" />
        <span className="absolute right-full mr-4 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat Zalo
        </span>
      </a>

      {/* Facebook Messenger */}
      <a 
        href="#" 
        className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform relative group"
        aria-label="Facebook Messenger"
      >
        <img src="/messenger.jpg" alt="Messenger" className="w-12 h-12 object-contain rounded-full" />
        <span className="absolute right-full mr-4 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Messenger
        </span>
      </a>

      {/* Phone Hotline */}
      <a 
        href="tel:0123456789" 
        className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors relative group animate-bounce"
        aria-label="Hotline"
      >
        <Phone className="w-6 h-6" />
        <span className="absolute right-full mr-4 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Gọi ngay: 0123 456 789
        </span>
      </a>

    </div>

    {/* Chat Widget — rendered outside the column to avoid z-index conflicts */}
    <ChatWidget />
    </>
  );
};

export default FloatingWidgets;
