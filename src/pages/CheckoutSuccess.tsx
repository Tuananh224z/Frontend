import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ClipboardList, MapPin, Phone, User, CreditCard } from 'lucide-react';

export default function CheckoutSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const getPaymentMethodText = (method: string) => {
    if (method === 'COD') return 'Thanh toán khi nhận hàng (COD)';
    if (method === 'Online') return 'Chuyển khoản ngân hàng (VietQR)';
    return method;
  };

  return (
    <div className="min-h-[80vh] bg-slate-50/50 py-16 flex items-center justify-center w-full">
      <div className="w-full max-w-2xl px-4 sm:px-6">
        <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-xl text-center space-y-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl -ml-16 -mb-16" />

          {/* Success Checkmark Indicator */}
          <div className="flex justify-center relative">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100 text-emerald-500 shadow-sm animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
          </div>

          {/* Titles */}
          <div className="space-y-2 relative">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Đặt Hàng Thành Công!
            </h2>
            <p className="text-sm font-semibold text-slate-400 max-w-md mx-auto leading-relaxed">
              Cảm ơn bạn đã tin tưởng TechStore. Chúng tôi đã nhận được thông tin đơn hàng và sẽ liên hệ xác nhận sớm nhất có thể.
            </p>
          </div>

          {/* Order Details box */}
          {order && (
            <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-6 text-left space-y-4 max-w-lg mx-auto relative animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex justify-between">
                <span>Thông tin chi tiết đơn hàng</span>
                <span className="text-slate-800 font-bold lowercase tracking-normal">
                  #{order.orderCode}
                </span>
              </h3>

              <div className="space-y-3.5 text-xs text-slate-700 font-bold">
                {/* Khách hàng */}
                <div className="flex items-start gap-2.5">
                  <User className="w-4 h-4 text-slate-450 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Họ và tên người nhận</span>
                    <span className="text-slate-800">{order.shippingAddress?.fullName}</span>
                  </div>
                </div>

                {/* SĐT */}
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-slate-450 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Số điện thoại</span>
                    <span className="text-slate-800">{order.shippingAddress?.phone}</span>
                  </div>
                </div>

                {/* Địa chỉ */}
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-450 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Địa chỉ giao hàng</span>
                    <span className="text-slate-800 leading-relaxed block max-w-sm">
                      {order.shippingAddress?.street}
                      {order.shippingAddress?.ward ? `, ${order.shippingAddress.ward}` : ''}
                      {order.shippingAddress?.district ? `, ${order.shippingAddress.district}` : ''}
                      {order.shippingAddress?.city ? `, ${order.shippingAddress.city}` : ''}
                    </span>
                  </div>
                </div>

                {/* Phương thức thanh toán */}
                <div className="flex items-start gap-2.5">
                  <CreditCard className="w-4 h-4 text-slate-450 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Phương thức thanh toán</span>
                    <span className="text-slate-800">{getPaymentMethodText(order.paymentMethod)}</span>
                  </div>
                </div>

                {/* Tổng tiền */}
                <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                  <span className="text-slate-500">Tổng tiền thanh toán:</span>
                  <span className="text-base font-extrabold text-red-650">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto pt-2">
            <Link
              to="/orders"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 text-xs border-0 cursor-pointer shadow-md shadow-slate-200"
            >
              <ClipboardList className="w-4 h-4" />
              Quản lý đơn hàng
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3.5 bg-red-600 hover:bg-red-750 text-white font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 text-xs border-0 cursor-pointer shadow-md shadow-red-100"
            >
              <ShoppingBag className="w-4 h-4" />
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
