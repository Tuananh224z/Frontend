import { useLocation, Link } from 'react-router-dom';
import { AlertTriangle, ShoppingCart, Home } from 'lucide-react';

export default function CheckoutFailure() {
  const location = useLocation();
  const errorMessage = location.state?.message || 'Đã xảy ra lỗi trong quá trình xử lý đơn hàng hoặc thanh toán của bạn.';

  return (
    <div className="min-h-[80vh] bg-slate-50/50 py-16 flex items-center justify-center w-full">
      <div className="w-full max-w-xl px-4 sm:px-6">
        <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-xl text-center space-y-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -ml-16 -mb-16" />

          {/* Failure Checkmark Indicator */}
          <div className="flex justify-center relative">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border-4 border-red-100 text-red-500 shadow-sm animate-pulse">
              <AlertTriangle className="w-10 h-10" />
            </div>
          </div>

          {/* Titles */}
          <div className="space-y-2 relative">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Thanh Toán Chưa Hoàn Tất
            </h2>
            <p className="text-sm font-semibold text-slate-500 max-w-sm mx-auto leading-relaxed">
              {errorMessage}
            </p>
          </div>

          {/* Help box */}
          <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-5 text-left text-xs text-slate-650 font-bold max-w-md mx-auto space-y-2">
            <p className="text-slate-850 font-extrabold flex items-center gap-1.5 text-xs">
              Bạn có thể làm gì lúc này?
            </p>
            <ul className="list-disc pl-4 space-y-1.5 font-medium leading-relaxed">
              <li>Kiểm tra lại số dư tài khoản ngân hàng của bạn.</li>
              <li>Nếu đơn hàng đã được khởi tạo, bạn có thể vào mục **"Đơn mua"** trong tài khoản cá nhân để quét lại mã thanh toán QR bất kỳ lúc nào.</li>
              <li>Liên hệ bộ phận CSKH trực tuyến của chúng tôi nếu bạn cần hỗ trợ nhanh.</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto pt-2">
            <Link
              to="/cart"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 text-xs border-0 cursor-pointer shadow-md shadow-slate-200"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              Quay lại giỏ hàng
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3.5 bg-red-650 hover:bg-red-700 text-white font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 text-xs border-0 cursor-pointer shadow-md shadow-red-100"
            >
              <Home className="w-4.5 h-4.5" />
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
