import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2, ShieldCheck } from 'lucide-react';
import { useCart, type Product } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

import { formatPrice } from '../../utils/format';
import { getProductImage } from '../../utils/productHelper';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, totalItems, totalAmount } = useCart();
  const getSpecsString = (product: Product) => {
    const parts = [];
    if (product.specs?.ram) parts.push(`RAM ${product.specs.ram}`);
    if (product.specs?.storage) parts.push(`SSD ${product.specs.storage}`);
    return parts.length > 0 ? `Phiên bản: ${parts.join(' - ')}` : 'Phiên bản: Standard';
  };

  // Tính tổng tiền gốc (chưa giảm giá) và tổng tiền tiết kiệm
  const originalTotal = cartItems.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  const savingsTotal = originalTotal - totalAmount;

  const { user } = useAuth();
  const navigate = useNavigate();

  // Xử lý khi nhấn nút Đặt Hàng
  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  // 1. TRẠNG THÁI TRỐNG (EMPTY STATE)
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50/50 py-16 px-4">
        <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200/60 mb-6 text-slate-300 shadow-xs">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Giỏ hàng của bạn đang trống</h3>
        <p className="text-slate-400 text-sm mt-2">Hãy chọn thêm sản phẩm vào giỏ hàng nhé!</p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center gap-2 mt-8 px-6 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl transition-all shadow-lg shadow-red-100 hover:shadow-red-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  // 2. TRẠNG THÁI CÓ SẢN PHẨM (POPULATED STATE)
  return (
    <div className="min-h-screen bg-slate-50/50 py-10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 mb-6 flex items-center gap-1.5">
          <Link to="/" className="hover:text-red-650 transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Giỏ hàng ({totalItems})</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8">
          Giỏ hàng của bạn
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
          {/* CỘT DANH SÁCH SẢN PHẨM (BÊN TRÁI) */}
          <div className="lg:col-span-2 w-full">
            {/* Header Bảng */}
            <div className="hidden lg:grid grid-cols-12 gap-4 items-center px-5 py-2 text-xs font-bold text-slate-400 mb-2">
              <span className="col-span-6 text-left">Sản phẩm</span>
              <span className="col-span-2 text-center">Đơn giá</span>
              <span className="col-span-2 text-center">Số lượng</span>
              <span className="col-span-2 text-right">Thành tiền</span>
            </div>

            {/* Danh sách items */}
            <div className="space-y-4">
              {cartItems.map((item) => {
                const product = item.product;
                const hasDiscount = product.discountPrice ? product.discountPrice > product.price : false;
                const unitPrice = product.price;
                const itemTotalPrice = unitPrice * item.quantity;

                return (
                  <div 
                    key={product._id} 
                    className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center"
                  >
                    
                    {/* Phần thông tin sản phẩm (Trái - chiếm 6/12 cột trên lg) */}
                    <div className="col-span-1 lg:col-span-6 flex gap-4 items-start min-w-0">
                      
                      {/* Ảnh sản phẩm - Khóa cứng kích thước 96x96 bằng style */}
                      <div 
                        style={{ width: '96px', height: '96px', minWidth: '96px', minHeight: '96px' }}
                        className="rounded-xl border border-slate-200/60 bg-slate-50/50 overflow-hidden shrink-0 flex items-center justify-center p-1.5"
                      >
                        <img 
                          src={getProductImage(product.images)} 
                          alt={product.name} 
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      
                      {/* Chi tiết tên, specs, nút xóa */}
                      <div className="flex flex-col justify-between min-h-[96px] py-0.5 min-w-0">
                        <div>
                          <h4 className="font-bold text-sm sm:text-base text-slate-800 line-clamp-2 hover:text-red-650 transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 font-medium">
                            {getSpecsString(product)}
                          </p>
                        </div>
                        
                        {/* Nút xóa */}
                        <button 
                          onClick={() => removeFromCart(product._id)}
                          className="flex items-center gap-1.5 text-xs font-bold text-red-650 hover:text-red-700 mt-2 transition-colors cursor-pointer w-fit group"
                        >
                          <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                          <span>Xóa</span>
                        </button>
                      </div>

                    </div>

                    {/* Phần Đơn giá (lg: col-span-2) */}
                    <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center text-center">
                      <span className="font-bold text-sm sm:text-base text-slate-800">
                        {formatPrice(product.price)}
                      </span>
                      {hasDiscount && (
                        <span className="text-[11px] text-slate-400 line-through mt-0.5">
                          {formatPrice(product.discountPrice!)}
                        </span>
                      )}
                    </div>

                    {/* Phần Số lượng (lg: col-span-2) */}
                    <div className="hidden lg:flex lg:col-span-2 justify-center">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-white p-0.5 shrink-0">
                        <button 
                          onClick={() => updateQuantity(product._id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all font-semibold cursor-pointer text-base"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-bold text-sm text-slate-800">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(product._id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all font-semibold cursor-pointer text-base"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Phần Thành tiền (lg: col-span-2) */}
                    <div className="hidden lg:flex lg:col-span-2 text-right justify-end">
                      <span className="font-extrabold text-sm sm:text-base text-red-650">
                        {formatPrice(itemTotalPrice)}
                      </span>
                    </div>

                    {/* Mobile Controls (Chỉ hiển thị khi < lg, co giãn cho đẹp mắt) */}
                    <div className="flex lg:hidden items-center justify-between w-full border-t border-slate-100 pt-4">
                      {/* Đơn giá */}
                      <div className="flex flex-col items-start">
                        <span className="text-xs text-slate-400 font-medium mb-1">Đơn giá</span>
                        <span className="font-bold text-sm text-slate-800">
                          {formatPrice(product.price)}
                        </span>
                        {hasDiscount && (
                          <span className="text-[10px] text-slate-400 line-through">
                            {formatPrice(product.discountPrice!)}
                          </span>
                        )}
                      </div>

                      {/* Bộ tăng giảm số lượng */}
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-slate-400 font-medium mb-1">Số lượng</span>
                        <div className="flex items-center border border-slate-200 rounded-xl bg-white p-0.5 shrink-0">
                          <button 
                            onClick={() => updateQuantity(product._id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all font-semibold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-xs text-slate-800">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(product._id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all font-semibold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Thành tiền */}
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-slate-400 font-medium mb-1">Thành tiền</span>
                        <span className="font-extrabold text-sm text-red-650">
                          {formatPrice(itemTotalPrice)}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Nút tiếp tục mua sắm phía dưới */}
            <div className="mt-6 text-left">
              <Link 
                to="/" 
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                Tiếp tục mua sắm
              </Link>
            </div>

          </div>

          {/* CỘT TÓM TẮT ĐƠN HÀNG (BÊN PHẢI) */}
          <div className="lg:col-span-1 w-full">
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs space-y-6">
              
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Tóm tắt đơn hàng
              </h3>

              <div className="space-y-4 text-sm">
                
                {/* Tạm tính */}
                <div className="flex justify-between items-center text-slate-500">
                  <span>Tạm tính ({totalItems} sản phẩm)</span>
                  <span className="font-semibold text-slate-800">
                    {formatPrice(originalTotal)}
                  </span>
                </div>

                {/* Tiết kiệm */}
                {savingsTotal > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 font-medium">
                    <span>Tiết kiệm</span>
                    <span>-{formatPrice(savingsTotal)}</span>
                  </div>
                )}

                <div className="border-t border-slate-100 my-2"></div>

                {/* Phí vận chuyển */}
                <div className="flex justify-between items-center text-slate-500">
                  <span>Phí vận chuyển</span>
                  <span className="text-xs text-slate-400 font-medium">Tính khi thanh toán</span>
                </div>

                <div className="border-t border-slate-100 my-2"></div>

                {/* Tổng tiền */}
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-800 mt-1">Tổng tiền</span>
                  <div className="text-right">
                    <span className="block font-extrabold text-2xl text-red-650 leading-none">
                      {formatPrice(totalAmount)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                      (Đã bao gồm VAT nếu có)
                    </span>
                  </div>
                </div>

              </div>

              {/* Nút đặt hàng */}
              <button 
                onClick={handleCheckout}
                className="w-full py-4 bg-red-650 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-md shadow-red-100 hover:shadow-lg hover:shadow-red-200/80 cursor-pointer text-center text-base"
              >
                Tiến Hành Đặt Hàng
              </button>

              {/* Bảo mật theo hình ảnh mẫu */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 pt-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>Thanh toán an toàn, bảo mật</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
