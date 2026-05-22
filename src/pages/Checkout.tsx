import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { MapPin, CreditCard, Truck, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import orderService from '../services/orderService';
import QRPaymentModal from '../components/common/QRPaymentModal';

const BACKEND_URL = 'http://localhost:5000';

export default function Checkout() {
  const { user, loading: authLoading } = useAuth();
  const { cartItems, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  // Form states
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('COD');
  
  // Action states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    }
  }, [user, authLoading, navigate]);

  // Redirect to cart if cart is empty (and we haven't just created an order)
  useEffect(() => {
    if (!authLoading && cartItems.length === 0 && !createdOrderId) {
      navigate('/cart');
    }
  }, [cartItems, authLoading, navigate, createdOrderId]);

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-slate-50/50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-red-650" />
          <p className="text-sm font-semibold text-slate-500">Đang tải thông tin tài khoản...</p>
        </div>
      </div>
    );
  }

  // Check if user has address
  const hasAddress = !!(user?.address?.street && user?.address?.city);
  const formattedAddress = hasAddress
    ? `${user.address?.street}${user.address?.ward ? `, ${user.address.ward}` : ''}${user.address?.district ? `, ${user.address.district}` : ''}, ${user.address?.city}`
    : '';

  // Calculate pricing
  const subtotal = totalAmount;
  const shippingFee = subtotal > 15000000 ? 0 : 50000;
  const grandTotal = subtotal + shippingFee;

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

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

  const handlePlaceOrder = async () => {
    if (!hasAddress) {
      setError('Vui lòng thêm địa chỉ giao hàng trước khi đặt hàng.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const orderPayload = {
        shippingAddress: {
          fullName: user.fullName,
          phone: user.phone || 'Chưa cung cấp SĐT',
          street: user.address?.street || '',
          ward: user.address?.ward || '',
          district: user.address?.district || '',
          city: user.address?.city || ''
        },
        paymentMethod,
        notes,
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        }))
      };

      const response = await orderService.createOrder(orderPayload);
      if (response.data?.status === 'success') {
        const newOrder = response.data.data;
        
        if (paymentMethod === 'COD') {
          // Clear local cart
          clearCart();
          // Redirect immediately to Success page for COD
          navigate('/checkout/success', { state: { order: newOrder } });
        } else {
          // Open QR code payment modal for Online method
          setCreatedOrderId(newOrder._id);
        }
      } else {
        setError('Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
      }
    } catch (err: any) {
      console.error('Lỗi đặt hàng:', err);
      setError(err.response?.data?.message || err.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 mb-6 flex items-center gap-1.5">
          <Link to="/" className="hover:text-red-650 transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-red-650 transition-colors">Giỏ hàng</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Thanh toán đơn hàng</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8">
          Thanh toán đơn hàng
        </h1>

        {error && (
          <div className="mb-6 flex items-center gap-2.5 p-4 bg-red-50 text-red-650 text-sm font-bold rounded-2xl border border-red-100 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          {/* CỘT TRÁI - THÔNG TIN GIAO HÀNG & PHƯƠNG THỨC THANH TOÁN (8/12 cột) */}
          <div className="lg:col-span-8 space-y-6 w-full">
            {/* 1. THÔNG TIN GIAO HÀNG */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-5">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3">
                <MapPin className="w-5 h-5 text-red-600" />
                Thông tin giao hàng
              </h3>

              {hasAddress ? (
                <div className="p-4 bg-slate-50/80 border border-slate-100 rounded-2xl flex items-start justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-slate-800">{user.fullName}</span>
                      <span className="text-slate-300 text-xs">|</span>
                      <span className="text-xs text-slate-500 font-bold">{user.phone || 'Chưa cung cấp SĐT'}</span>
                    </div>
                    <p className="text-xs text-slate-650 font-bold leading-relaxed truncate">
                      {formattedAddress}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/addresses')}
                    className="text-xs font-bold text-red-650 hover:text-red-700 transition-colors cursor-pointer shrink-0 border-0 bg-transparent"
                  >
                    Thay đổi
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div 
                    onClick={() => navigate('/addresses')}
                    className="border-2 border-dashed border-slate-200 hover:border-red-500/50 bg-slate-50/50 hover:bg-red-50/10 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    <span className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-red-50 flex items-center justify-center text-slate-400 group-hover:text-red-600 transition-colors">
                      +
                    </span>
                    <span className="text-xs font-bold text-slate-600 group-hover:text-slate-800">Quản lý địa chỉ</span>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3.5 bg-amber-50 text-amber-800 text-xs font-bold rounded-2xl border border-amber-100">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0 text-amber-600" />
                    <span>Bạn chưa có địa chỉ nào. <Link to="/addresses" className="underline hover:text-amber-900">Thêm địa chỉ mới</Link> để tiếp tục.</span>
                  </div>
                </div>
              )}

              {/* Ghi chú */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                  Ghi chú đơn hàng (Tùy chọn)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ghi chú về thời gian giao hàng, hướng dẫn tìm địa chỉ..."
                  rows={3}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden rounded-2xl text-xs font-semibold transition-all duration-200 resize-none"
                />
              </div>
            </div>

            {/* 2. PHƯƠNG THỨC THANH TOÁN */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-5">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3">
                <CreditCard className="w-5 h-5 text-red-650" />
                Phương thức thanh toán
              </h3>

              <div className="space-y-3">
                {/* Option 1: COD */}
                <div 
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 border rounded-2xl flex items-center gap-4 cursor-pointer transition-all duration-200 ${
                    paymentMethod === 'COD' 
                      ? 'border-red-500 bg-red-50/10 shadow-xs' 
                      : 'border-slate-200/60 hover:bg-slate-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="w-4.5 h-4.5 text-red-600 focus:ring-red-500 border-slate-300"
                  />
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">Thanh toán khi nhận hàng (COD)</h4>
                    <p className="text-xs text-slate-400 font-bold mt-0.5">Kiểm tra hàng trước khi thanh toán</p>
                  </div>
                </div>

                {/* Option 2: Online QR */}
                <div 
                  onClick={() => setPaymentMethod('Online')}
                  className={`p-4 border rounded-2xl flex items-center gap-4 cursor-pointer transition-all duration-200 ${
                    paymentMethod === 'Online' 
                      ? 'border-red-500 bg-red-50/10 shadow-xs' 
                      : 'border-slate-200/60 hover:bg-slate-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'Online'}
                    onChange={() => setPaymentMethod('Online')}
                    className="w-4.5 h-4.5 text-red-600 focus:ring-red-500 border-slate-300"
                  />
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">Chuyển khoản ngân hàng</h4>
                    <p className="text-xs text-slate-400 font-bold mt-0.5">Thanh toán an toàn qua cổng VietQR / Casso</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI - TÓM TẮT ĐƠN HÀNG (4/12 cột) */}
          <div className="lg:col-span-4 w-full">
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-6">
              <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3">
                Đơn hàng của bạn
              </h3>

              {/* Items List */}
              <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1 space-y-3">
                {cartItems.map((item) => {
                  const product = item.product;
                  const price = product.price;
                  return (
                    <div key={product._id} className="flex gap-3 pt-3 first:pt-0 items-start">
                      <div className="w-12 h-12 rounded-lg border border-slate-100 bg-slate-50 p-1 overflow-hidden shrink-0 flex items-center justify-center">
                        <img 
                          src={getProductImage(product.images)} 
                          alt={product.name} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-grow">
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                          {product.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Số lượng: {item.quantity}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-850 shrink-0">
                        {formatPrice(price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-3.5 text-xs">
                {/* Tạm tính */}
                <div className="flex justify-between items-center text-slate-500 font-bold">
                  <span>Tạm tính</span>
                  <span className="text-slate-800">{formatPrice(subtotal)}</span>
                </div>

                {/* Phí vận chuyển */}
                <div className="flex justify-between items-center text-slate-500 font-bold">
                  <span>Phí vận chuyển</span>
                  <span className="text-slate-800">{formatPrice(shippingFee)}</span>
                </div>

                <div className="border-t border-slate-100 my-2"></div>

                {/* Tổng cộng */}
                <div className="flex justify-between items-end">
                  <span className="font-extrabold text-slate-800 text-sm">Tổng cộng</span>
                  <span className="font-black text-xl text-red-650 leading-none">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Nút đặt hàng */}
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting || !hasAddress}
                className="w-full py-4 bg-red-650 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-450 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 shadow-md shadow-red-100 cursor-pointer text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Đặt Hàng <ShieldCheck className="w-4.5 h-4.5" />
                  </>
                )}
              </button>

              <span className="text-[10px] text-slate-400 font-bold text-center block leading-relaxed max-w-[240px] mx-auto">
                Bằng cách đặt hàng, bạn đồng ý với Điều khoản sử dụng của TechStore.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QR payment modal */}
      {createdOrderId && (
        <QRPaymentModal
          orderId={createdOrderId}
          onClose={() => {
            // If they close the modal, redirect them to failure page so they can pay again later or view orders
            navigate('/checkout/failure', { 
              state: { 
                orderId: createdOrderId,
                message: 'Thanh toán chưa hoàn tất. Bạn có thể thanh toán lại bất kỳ lúc nào trong danh sách đơn hàng.' 
              } 
            });
            setCreatedOrderId(null);
          }}
          onPaymentSuccess={() => {
            // Once webhook succeeds and polling detects paid status
            // Redirect to Success page
            orderService.getOrderDetails(createdOrderId).then((res) => {
              const fullOrder = res.data?.data;
              clearCart();
              navigate('/checkout/success', { state: { order: fullOrder || { _id: createdOrderId, orderCode: 'Đơn hàng Online' } } });
              setCreatedOrderId(null);
            });
          }}
        />
      )}
    </div>
  );
}
