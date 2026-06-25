import React, { createContext, useContext, useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import type { Product } from '../types/product';
import type { CartItem } from '../types/cart';

// Re-export để các file đang import từ CartContext vẫn hoạt động
export type { Product } from '../types/product';
export type { CartItem } from '../types/cart';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const getProductImage = (images: string[]) => {
  if (!images || images.length === 0) {
    return 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500';
  }
  const firstImg = images[0];
  if (firstImg.startsWith('http://') || firstImg.startsWith('https://')) {
    return firstImg;
  }
  const cleanPath = firstImg.startsWith('/') ? firstImg : `/${firstImg}`;
  return `${BACKEND_URL}${cleanPath}`;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<{
    show: boolean;
    productName: string;
    productImage: string;
  }>({
    show: false,
    productName: '',
    productImage: '',
  });

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('antigravity_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          // Lọc bỏ những sản phẩm có ID không hợp lệ (không phải 24 ký tự hex)
          const validItems = parsed.filter((item: any) => 
            item && item.product && item.product._id && /^[0-9a-fA-F]{24}$/.test(item.product._id)
          );
          if (validItems.length !== parsed.length) {
            saveCart(validItems);
          } else {
            setCartItems(validItems);
          }
        }
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('antigravity_cart', JSON.stringify(items));
  };

  const addToCart = (product: Product, quantity = 1) => {
    const existingIndex = cartItems.findIndex(item => item.product._id === product._id);
    const updated = [...cartItems];
    if (existingIndex > -1) {
      updated[existingIndex].quantity += quantity;
    } else {
      updated.push({ product, quantity });
    }
    saveCart(updated);

    // Show custom toast notification
    const imgUrl = getProductImage(product.images || []);
    setToast({
      show: true,
      productName: product.name,
      productImage: imgUrl,
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = cartItems.map(item => 
      item.product._id === productId ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  const removeFromCart = (productId: string) => {
    const updated = cartItems.filter(item => item.product._id !== productId);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  const totalAmount = cartItems.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      totalItems,
      totalAmount
    }}>
      {children}

      {/* Toast Notification */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-[92%] sm:w-auto sm:min-w-[380px] max-w-md p-4 rounded-2xl shadow-xl transition-all duration-300 transform ${
          toast.show
            ? 'translate-y-0 opacity-100 scale-100'
            : '-translate-y-12 opacity-0 scale-95 pointer-events-none'
        } bg-white/90 backdrop-blur-md border border-slate-200/80 flex items-center justify-between gap-4`}
      >
        <div className="flex items-center gap-3">
          {/* Success Check Icon */}
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <Check className="w-5.5 h-5.5 stroke-[2.5]" />
          </div>
          
          {/* Product Thumbnail */}
          {toast.productImage && (
            <img
              src={toast.productImage}
              alt={toast.productName}
              className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
            />
          )}

          {/* Toast Message */}
          <div className="text-left">
            <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">Thêm thành công!</p>
            <p className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[150px] sm:max-w-[180px]">
              {toast.productName}
            </p>
          </div>
        </div>

        {/* Action Button & Close Button */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/cart"
            className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors whitespace-nowrap"
          >
            Xem giỏ hàng
          </a>
          <button
            onClick={() => setToast(prev => ({ ...prev, show: false }))}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
