import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import { Package, Calendar, DollarSign, Clock, CheckCircle, Truck, XCircle, ChevronRight, Loader2 } from 'lucide-react';
import QRPaymentModal from '../../components/common/QRPaymentModal';

const BACKEND_URL = 'http://localhost:5000';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [activeOrderIdForQR, setActiveOrderIdForQR] = useState<string | null>(null);

  const getProductImage = (images: string[]) => {
    if (!images || images.length === 0) return 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500';
    const firstImg = images[0];
    if (!firstImg) return 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500';
    if (firstImg.startsWith('http://') || firstImg.startsWith('https://')) return firstImg;
    const cleanPath = firstImg.startsWith('/') ? firstImg : `/${firstImg}`;
    return `${BACKEND_URL}${cleanPath}`;
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await orderService.getMyOrders();
      if (response.data?.status === 'success') {
        setOrders(response.data.data || []);
      } else {
        setOrders([]);
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      return;
    }
    try {
      setIsCancelling(true);
      const response = await orderService.cancelOrder(
        orderId,
        'Khách hàng yêu cầu hủy trên giao diện client'
      );
      if (response.data?.status === 'success') {
        alert('Hủy đơn hàng thành công!');
        fetchOrders();
        // Update selected order details
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(response.data.data);
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Hủy đơn hàng thất bại');
    } finally {
      setIsCancelling(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-50 rounded-full border border-amber-100">
            <Clock className="w-3 h-3" /> Chờ xử lý
          </span>
        );
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 rounded-full border border-blue-100">
            <CheckCircle className="w-3 h-3" /> Đã thanh toán
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 rounded-full border border-indigo-100">
            <Truck className="w-3 h-3" /> Đang vận chuyển
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-100">
            <CheckCircle className="w-3 h-3" /> Đã giao hàng
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-red-700 bg-red-50 rounded-full border border-red-100">
            <XCircle className="w-3 h-3" /> Đã hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-50 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">Đơn mua</h2>
        <p className="text-xs text-slate-400 font-bold mt-1">
          Quản lý và theo dõi trạng thái các đơn hàng đã đặt
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-xs">
          <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">Chưa có đơn hàng nào</h3>
          <p className="text-slate-400 text-sm font-medium">Bạn chưa thực hiện bất kỳ giao dịch mua sắm nào tại TechStore.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders list */}
          <div className="lg:col-span-2 space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className={`bg-white p-5 rounded-3xl border transition-all cursor-pointer ${
                  selectedOrder?._id === order._id ? 'border-red-500 shadow-md' : 'border-slate-100 shadow-xs hover:border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wide">
                    <span>Mã đơn:</span>
                    <span className="text-slate-700">#{order.orderCode || order._id.substring(order._id.length - 8)}</span>
                  </div>
                  <div>{getStatusBadge(order.orderStatus || order.status)}</div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 font-medium mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-slate-450" />
                    <span>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-slate-450" />
                    <span>Tổng tiền: <strong className="text-slate-800">{formatPrice(order.totalAmount || order.totalPrice)}</strong></span>
                  </div>
                </div>

                {/* Short preview of items */}
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold border-t border-slate-50 pt-3">
                  <span>{order.items?.length || 0} sản phẩm</span>
                  <span className="text-red-600 hover:text-red-750 flex items-center gap-0.5">
                    Xem chi tiết <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Selected order details details side panel */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md sticky top-28 space-y-6">
                <div className="border-b border-slate-150 pb-4">
                  <h3 className="font-extrabold text-slate-800 text-lg">Chi tiết đơn hàng</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Mã đơn: #{selectedOrder.orderCode || selectedOrder._id}</p>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Danh sách sản phẩm</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {selectedOrder.items?.map((item: any, index: number) => {
                      const itemContent = (
                        <>
                          <img
                            src={getProductImage(item.product?.images)}
                            alt={item.name || item.product?.name || 'Sản phẩm'}
                            className="w-12 h-12 object-contain bg-slate-50 rounded-xl p-1 shrink-0"
                          />
                          <div className="flex-grow">
                            <h5 className="font-bold text-slate-800 line-clamp-1 leading-snug hover:text-purple-600 transition-colors">
                              {item.name || item.product?.name || 'Sản phẩm'}
                            </h5>
                            <div className="text-xs font-medium text-slate-400 mt-0.5">
                              {formatPrice(item.price)} x {item.quantity}
                            </div>
                            <span className="inline-block text-[10px] text-purple-600 hover:underline font-bold mt-1">
                              Click để đánh giá sản phẩm này
                            </span>
                          </div>
                        </>
                      );

                      return item.product?.slug ? (
                        <Link 
                          key={index} 
                          to={`/product/${item.product.slug}`} 
                          className="flex gap-3 text-sm hover:bg-slate-50/80 p-1.5 rounded-xl transition-all w-full text-left"
                        >
                          {itemContent}
                        </Link>
                      ) : (
                        <div key={index} className="flex gap-3 text-sm p-1.5">
                          {itemContent}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recipient Details */}
                <div className="space-y-2 border-t border-slate-50 pt-4 text-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thông tin người nhận</h4>
                  <div className="font-semibold text-slate-800">{selectedOrder.shippingAddress?.fullName}</div>
                  <div className="text-xs text-slate-500 font-medium">SĐT: {selectedOrder.shippingAddress?.phone}</div>
                  <div className="text-xs text-slate-500 font-medium">
                    Địa chỉ: {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.ward}, {selectedOrder.shippingAddress?.district}, {selectedOrder.shippingAddress?.city}
                  </div>
                </div>

                {/* Price and payment details */}
                <div className="space-y-2 border-t border-slate-50 pt-4 text-sm font-medium">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tạm tính:</span>
                    <span className="text-slate-800 font-semibold">{formatPrice(selectedOrder.totalAmount || selectedOrder.totalPrice)}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-red-600 font-bold">
                      <span>Mã giảm giá:</span>
                      <span>-{formatPrice(selectedOrder.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-50 pt-2 text-base font-extrabold">
                    <span className="text-slate-800">Tổng thanh toán:</span>
                    <span className="text-red-650 text-red-600">{formatPrice(selectedOrder.totalAmount || selectedOrder.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-slate-400">Phương thức:</span>
                    <span className="text-slate-650 font-bold uppercase">
                      {selectedOrder.paymentMethod?.toUpperCase() === 'COD' ? 'Thanh toán COD' : 'Thanh toán trực tuyến'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-slate-400">Thanh toán:</span>
                    <span className={`font-bold ${selectedOrder.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {selectedOrder.paymentStatus === 'Paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {/* Nút thanh toán QR cho các đơn hàng Online và chưa thanh toán */}
                  {selectedOrder.paymentMethod?.toUpperCase() === 'ONLINE' && 
                   selectedOrder.paymentStatus !== 'Paid' && 
                   selectedOrder.orderStatus !== 'Cancelled' && (
                    <button
                      onClick={() => setActiveOrderIdForQR(selectedOrder._id)}
                      className="w-full py-3 bg-red-600 hover:bg-red-750 text-white font-extrabold rounded-2xl text-sm transition-colors border-0 cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-red-200/50"
                    >
                      Thanh toán qua QR Code
                    </button>
                  )}
                  
                  {(selectedOrder.orderStatus === 'Pending' || selectedOrder.status === 'Pending') && (
                    <button
                      onClick={() => handleCancelOrder(selectedOrder._id)}
                      disabled={isCancelling}
                      className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold rounded-2xl text-sm transition-colors border-0 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Hủy đơn hàng'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50/50 p-6 rounded-3xl border border-dashed border-slate-200 text-center py-12 text-slate-400 font-semibold text-sm">
                Vui lòng chọn một đơn hàng để xem chi tiết
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal quét QR thanh toán */}
      {activeOrderIdForQR && (
        <QRPaymentModal
          orderId={activeOrderIdForQR}
          onClose={() => setActiveOrderIdForQR(null)}
          onPaymentSuccess={() => {
            setActiveOrderIdForQR(null);
            // Reload đơn hàng sau khi thanh toán thành công
            fetchOrders();
            // Nếu đơn hàng đang chọn là đơn hàng vừa được thanh toán, update thông tin hiển thị
            if (selectedOrder && selectedOrder._id === activeOrderIdForQR) {
              orderService.getOrderDetails(activeOrderIdForQR).then((res) => {
                if (res.data?.status === 'success') {
                  setSelectedOrder(res.data.data);
                }
              });
            }
          }}
        />
      )}
    </div>
  );
}
