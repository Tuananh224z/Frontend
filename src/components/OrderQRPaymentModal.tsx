import { useState, useEffect, useRef } from 'react';
import { Copy, Check, Loader2, Building2, AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import orderService from '../services/orderService';

interface QRPaymentModalProps {
  orderId: string;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export default function QRPaymentModal({ orderId, onClose, onPaymentSuccess }: QRPaymentModalProps) {
  const [paymentData, setPaymentData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(true);

  const getBankName = (bankId: string) => {
    const id = String(bankId || '').toLowerCase();
    if (id === '970448' || id === 'ocb' || id === 'orientcommercialbank') {
      return 'OCB - Ngân hàng Phương Đông';
    }
    return 'OCB - Ngân hàng Phương Đông';
  };
  
  // State copy số tài khoản và nội dung chuyển khoản
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  
  // State đếm ngược (10 phút = 600 giây)
  const [timeLeft, setTimeLeft] = useState(30);
  
  // Trạng thái thanh toán: 'waiting' | 'success' | 'expired'
  const [paymentState, setPaymentState] = useState<'waiting' | 'success' | 'expired'>('waiting');

  const pollingIntervalRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (paymentData?.qrCodeUrl) {
      setIsImageLoading(true);
    }
  }, [paymentData?.qrCodeUrl]);

  // 1. Tải thông tin thanh toán QR từ Backend
  const fetchPaymentInfo = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await orderService.getQRPayment(orderId);
      if (response.data?.status === 'success') {
        setPaymentData(response.data.data);
      } else {
        setError('Không thể tải thông tin thanh toán QR.');
      }
    } catch (err: any) {
      console.error('Lỗi lấy thông tin QR:', err);
      setError(err.response?.data?.message || err.message || 'Không thể tải thông tin thanh toán.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentInfo();
    
    // Bắt đầu đếm ngược thời gian
    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current!);
          setPaymentState('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [orderId]);

  // 2. Chạy Polling kiểm tra trạng thái thanh toán đơn hàng mỗi 4 giây
  useEffect(() => {
    if (paymentState !== 'waiting') {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await orderService.getOrderDetails(orderId);
        const order = response.data?.data;
        if (order && order.paymentStatus === 'Paid') {
          // Xóa các timer
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          
          setPaymentState('success');
          
          // Chờ 3 giây rồi thông báo thành công và đóng modal
          setTimeout(() => {
            onPaymentSuccess();
          }, 3000);
        }
      } catch (err) {
        console.error('Lỗi khi polling kiểm tra trạng thái đơn hàng:', err);
      }
    }, 4000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [orderId, paymentState, onPaymentSuccess]);

  // Định dạng thời gian đếm ngược dạng MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper copy text
  const copyToClipboard = (text: string, type: 'account' | 'content') => {
    navigator.clipboard.writeText(text);
    if (type === 'account') {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    } else {
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto scrollbar-none animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl p-6 md:p-8 shadow-2xl relative border border-slate-100 flex flex-col md:flex-row gap-8 max-h-[90vh] overflow-y-auto scrollbar-none">
        
        {/* Nút đóng Modal */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-50 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isLoading ? (
          <div className="w-full flex flex-col items-center justify-center py-20 min-h-[350px]">
            <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-3" />
            <p className="text-sm font-semibold text-slate-500">Đang tải thông tin thanh toán...</p>
          </div>
        ) : error ? (
          <div className="w-full flex flex-col items-center justify-center py-16 text-center min-h-[350px]">
            <div className="p-3.5 bg-red-50 text-red-600 rounded-full border border-red-100 mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Đã xảy ra lỗi</h4>
            <p className="text-sm text-slate-500 max-w-md mb-6">{error}</p>
            <button
              onClick={fetchPaymentInfo}
              className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md cursor-pointer"
            >
              Thử tải lại
            </button>
          </div>
        ) : paymentState === 'success' ? (
          // Trạng thái thanh toán THÀNH CÔNG (Realtime)
          <div className="w-full flex flex-col items-center justify-center py-16 text-center min-h-[380px] animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100 text-emerald-500 mb-6 shadow-xs animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Thanh Toán Thành Công!</h3>
            <p className="text-sm text-slate-500 max-w-sm">
              Hệ thống đã nhận được số tiền chuyển khoản của bạn cho đơn hàng <strong className="text-slate-800">#{paymentData?.orderCode}</strong>.
            </p>
            <div className="mt-6 text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-full flex items-center gap-1.5 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Đang tự động chuyển hướng...</span>
            </div>
          </div>
        ) : paymentState === 'expired' ? (
          // Trạng thái mã QR HẾT HẠN
          <div className="w-full flex flex-col items-center justify-center py-16 text-center min-h-[380px]">
            <div className="p-3.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100 mb-4 animate-pulse">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Mã QR đã hết hạn thanh toán</h4>
            <p className="text-sm text-slate-500 max-w-xs mb-6">
              Thời gian giao dịch tối đa 10 phút đã trôi qua. Vui lòng đóng cửa sổ này và bấm thanh toán lại để tạo mã QR mới.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          </div>
        ) : (
          // TRẠNG THÁI HIỂN THỊ QUÉT MÃ QR (Chờ quét)
          <>
            {/* CỘT TRÁI - KHU VỰC QUÉT QR */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-8">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">Thanh toán QR</h3>
              
              <div className="text-center mb-4">
                <span className="text-xs text-slate-400 font-bold block mb-1">Số tiền</span>
                <span className="text-2xl font-black text-red-600 leading-none">
                  {formatPrice(paymentData?.totalAmount || 0)}
                </span>
              </div>

              {/* Nội dung chuyển khoản */}
              <div className="w-full max-w-xs bg-slate-50 border border-slate-200/60 rounded-xl p-3 mb-5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Nội dung chuyển khoản</span>
                  <span className="text-xs font-mono font-bold text-slate-700 truncate block mt-0.5">
                    {paymentData?.addInfo}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(paymentData?.addInfo || '', 'content')}
                  className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-all shrink-0 cursor-pointer"
                  title="Sao chép nội dung"
                >
                  {copiedContent ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Đang kiểm tra thanh toán */}
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-5 bg-blue-50/50 px-3.5 py-1.5 rounded-full border border-blue-100/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                <span>Đang kiểm tra thanh toán...</span>
              </div>

              {/* Ảnh QR Code */}
              <div className="relative bg-white border border-slate-200/60 p-4 rounded-2xl shadow-xs flex items-center justify-center mb-5 w-[240px] h-[240px] overflow-hidden shrink-0">
                {isImageLoading && (
                  <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center animate-pulse">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400 mb-2" />
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider">Đang tải mã QR...</span>
                  </div>
                )}
                <img 
                  src={paymentData?.qrCodeUrl} 
                  alt="VietQR code" 
                  onLoad={() => setIsImageLoading(false)}
                  className={`w-full h-full object-contain transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                />
              </div>

              {/* Bộ đếm ngược thời gian */}
              <div className="bg-amber-50 border border-amber-200/60 rounded-xl px-4 py-2 text-center text-xs font-bold text-amber-800 flex items-center gap-1.5 shadow-xs">
                <span>MÃ QR HẾT HẠN SAU:</span>
                <span className="font-mono text-sm tracking-wider text-amber-900 font-extrabold">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* CỘT PHẢI - THÔNG TIN CHI TIẾT & HƯỚNG DẪN */}
            <div className="w-full md:w-1/2 flex flex-col justify-between space-y-6">
              <div>
                <h4 className="text-base font-extrabold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-50 pb-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Thông tin chuyển khoản
                </h4>

                <div className="space-y-3">
                  {/* Ngân hàng */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50/80 border border-slate-100 rounded-2xl">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Ngân hàng</span>
                      <span className="text-sm font-black text-slate-800 mt-0.5 block">
                        {getBankName(paymentData?.bankId)}
                      </span>
                    </div>
                  </div>

                  {/* Số tài khoản */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50/80 border border-slate-100 rounded-2xl gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Số tài khoản</span>
                      <span className="text-sm font-black text-slate-800 mt-0.5 block tracking-wide font-mono">
                        {paymentData?.accountNo}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(paymentData?.accountNo || '', 'account')}
                      className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-all shrink-0 cursor-pointer"
                      title="Sao chép số tài khoản"
                    >
                      {copiedAccount ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Chủ tài khoản */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50/80 border border-slate-100 rounded-2xl">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Chủ tài khoản</span>
                      <span className="text-sm font-black text-slate-800 mt-0.5 block">
                        {paymentData?.accountName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hướng dẫn thanh toán */}
              <div className="bg-blue-50/30 border border-blue-100/50 rounded-2xl p-4 text-xs text-slate-600 space-y-3">
                <h5 className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                  Hướng dẫn thanh toán
                </h5>
                <ol className="space-y-2.5 font-medium">
                  <li className="flex gap-2">
                    <span className="flex items-center justify-center w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-black shrink-0 mt-0.5">1</span>
                    <span>Mở ứng dụng ngân hàng hoặc ví điện tử để bắt đầu.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex items-center justify-center w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-black shrink-0 mt-0.5">2</span>
                    <span>Quét mã QR đối diện hoặc nhập thông tin chuyển khoản thủ công.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex items-center justify-center w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-black shrink-0 mt-0.5">3</span>
                    <span>Kiểm tra kỹ Số tiền chuyển khoản và Nội dung chuyển khoản.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex items-center justify-center w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-black shrink-0 mt-0.5">4</span>
                    <span>Bấm xác nhận chuyển khoản và hoàn tất giao dịch.</span>
                  </li>
                </ol>
              </div>



              {/* Chú ý lưu ý */}
              <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-2xl text-[10px] text-amber-800/80 font-bold leading-normal">
                ⚠️ Lưu ý: Vui lòng giữ lại biên lai thanh toán cho đến khi đơn hàng được duyệt hoàn tất. Không nên đóng cửa sổ này khi hệ thống đang kiểm tra tự động.
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
