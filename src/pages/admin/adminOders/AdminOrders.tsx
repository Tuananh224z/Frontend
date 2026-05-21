import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { ShoppingCart, Search, Edit3, CheckCircle2, AlertCircle, Loader2, Eye, Calendar, DollarSign, User } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Edit Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Detail Modal State
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await api.get('/orders');
      if (response.data?.status === 'success') {
        setOrders(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenEditModal = (order: any) => {
    setSelectedOrder(order);
    setOrderStatus(order.orderStatus);
    setPaymentStatus(order.paymentStatus);
    setIsModalOpen(true);
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      const response = await api.put(`/orders/${selectedOrder._id}/status`, {
        orderStatus,
        paymentStatus,
      });

      if (response.data?.status === 'success') {
        setSuccess(`Cập nhật trạng thái đơn hàng ${selectedOrder.orderCode} thành công!`);
        setIsModalOpen(false);
        fetchOrders();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Cập nhật trạng thái thất bại');
    } finally {
      setIsSaving(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderCode.toLowerCase().includes(search.toLowerCase()) ||
      (order.user?.fullName && order.user.fullName.toLowerCase().includes(search.toLowerCase())) ||
      (order.user?.email && order.user.email.toLowerCase().includes(search.toLowerCase())) ||
      (order.shippingAddress?.phone && order.shippingAddress.phone.includes(search));

    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    const matchesPayment = paymentFilter === 'All' || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getOrderStatusClass = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'text-amber-400 bg-amber-950/20 border-amber-900/40';
      case 'Confirmed':
        return 'text-blue-400 bg-blue-950/20 border-blue-900/40';
      case 'Processing':
        return 'text-indigo-400 bg-indigo-950/20 border-indigo-900/40';
      case 'Shipping':
        return 'text-purple-400 bg-purple-950/20 border-purple-900/40';
      case 'Delivered':
        return 'text-emerald-400 bg-emerald-950/20 border-emerald-900/40';
      case 'Cancelled':
        return 'text-red-400 bg-red-950/20 border-red-900/40';
      default:
        return 'text-slate-400 bg-slate-800/20 border-slate-700/40';
    }
  };

  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'text-emerald-400 bg-emerald-950/20 border-emerald-900/40';
      case 'Pending':
        return 'text-amber-400 bg-amber-950/20 border-amber-900/40';
      case 'Failed':
        return 'text-red-400 bg-red-950/20 border-red-900/40';
      default:
        return 'text-slate-400 bg-slate-800/20 border-slate-700/40';
    }
  };

  const statusTranslations: Record<string, string> = {
    Pending: 'Chờ xử lý',
    Confirmed: 'Đã xác nhận',
    Processing: 'Đang chuẩn bị',
    Shipping: 'Đang giao hàng',
    Delivered: 'Đã giao hàng',
    Cancelled: 'Đã hủy',
    Paid: 'Đã thanh toán',
    Failed: 'Thất bại',
  };

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm mã đơn, tên, email, sđt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:border-purple-500 focus:outline-hidden"
            >
              <option value="All">Tất cả đơn hàng</option>
              <option value="Pending">Chờ xử lý</option>
              <option value="Confirmed">Đã xác nhận</option>
              <option value="Processing">Đang chuẩn bị</option>
              <option value="Shipping">Đang giao hàng</option>
              <option value="Delivered">Đã giao hàng</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thanh toán:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:border-purple-500 focus:outline-hidden"
            >
              <option value="All">Tất cả thanh toán</option>
              <option value="Pending">Chờ thanh toán</option>
              <option value="Paid">Đã thanh toán</option>
              <option value="Failed">Thất bại</option>
            </select>
          </div>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-950/20 text-emerald-400 text-sm font-semibold rounded-xl border border-emerald-900">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-950/20 text-red-400 text-sm font-semibold rounded-xl border border-red-900">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Orders Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800/80 text-slate-400 font-semibold text-sm">
          <ShoppingCart className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          Không tìm thấy đơn hàng nào
        </div>
      ) : (
        <div className="bg-slate-900 rounded-3xl border border-slate-800/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-450 font-bold bg-slate-900/50">
                  <th className="px-6 py-4">Mã đơn</th>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Ngày đặt</th>
                  <th className="px-6 py-4">Phương thức</th>
                  <th className="px-6 py-4">Thanh toán</th>
                  <th className="px-6 py-4">Trạng thái đơn</th>
                  <th className="px-6 py-4">Tổng tiền</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-850/40 transition-colors text-sm">
                    {/* Order Code */}
                    <td className="px-6 py-4 font-extrabold text-white">{order.orderCode}</td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="min-w-[150px]">
                        <div className="font-bold text-slate-200">{order.user?.fullName || order.shippingAddress?.fullName}</div>
                        <div className="text-xs text-slate-400">{order.user?.email || 'N/A'}</div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs font-semibold text-slate-350">{formatDate(order.createdAt)}</td>

                    {/* Payment Method */}
                    <td className="px-6 py-4 text-xs font-bold text-slate-400">
                      {order.paymentMethod === 'Online' ? 'Trực tuyến' : 'COD'}
                    </td>

                    {/* Payment Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full border ${getPaymentStatusClass(order.paymentStatus)}`}>
                        {statusTranslations[order.paymentStatus] || order.paymentStatus}
                      </span>
                    </td>

                    {/* Order Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full border ${getOrderStatusClass(order.orderStatus)}`}>
                        {statusTranslations[order.orderStatus] || order.orderStatus}
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td className="px-6 py-4 font-extrabold text-purple-400">{formatPrice(order.totalAmount)}</td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setDetailOrder(order);
                            setIsDetailOpen(true);
                          }}
                          className="p-2 text-slate-450 hover:text-purple-400 hover:bg-purple-950/20 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(order)}
                          className="p-2 text-slate-450 hover:text-blue-400 hover:bg-blue-950/20 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
                          title="Cập nhật trạng thái"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailOpen && detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-purple-500" />
                Chi tiết đơn hàng: {detailOrder.orderCode}
              </h3>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="text-slate-400 hover:text-white border-0 bg-transparent cursor-pointer font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {/* Customer and Delivery Info */}
              <div className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                <h4 className="font-extrabold text-xs text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4.5 h-4.5" /> Thông tin giao hàng
                </h4>
                <div className="space-y-2 text-xs font-semibold text-slate-350">
                  <p><span className="text-slate-500">Họ và tên:</span> {detailOrder.shippingAddress?.fullName || detailOrder.user?.fullName}</p>
                  <p><span className="text-slate-500">Số điện thoại:</span> {detailOrder.shippingAddress?.phone || detailOrder.user?.phone || 'N/A'}</p>
                  <p><span className="text-slate-500">Email khách:</span> {detailOrder.user?.email || 'N/A'}</p>
                  <p>
                    <span className="text-slate-500">Địa chỉ:</span>{' '}
                    {detailOrder.shippingAddress?.street}, {detailOrder.shippingAddress?.ward}, {detailOrder.shippingAddress?.district}, {detailOrder.shippingAddress?.city}
                  </p>
                  {detailOrder.notes && (
                    <p className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-amber-400 text-[11px] font-medium mt-2">
                      <span className="font-bold block text-slate-400 mb-0.5">Ghi chú từ khách:</span>
                      {detailOrder.notes}
                    </p>
                  )}
                  {detailOrder.cancelledReason && (
                    <p className="p-2.5 bg-red-950/20 border border-red-900/40 rounded-xl text-red-400 text-[11px] font-medium mt-2">
                      <span className="font-bold block text-red-300 mb-0.5">Lý do hủy đơn:</span>
                      {detailOrder.cancelledReason}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment and Process status */}
              <div className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                <h4 className="font-extrabold text-xs text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4.5 h-4.5" /> Trạng thái đơn hàng
                </h4>
                <div className="space-y-3 text-xs font-semibold text-slate-350">
                  <p><span className="text-slate-500">Ngày đặt hàng:</span> {formatDate(detailOrder.createdAt)}</p>
                  <p><span className="text-slate-500">Phương thức thanh toán:</span> {detailOrder.paymentMethod === 'Online' ? 'Chuyển khoản trực tuyến' : 'Thanh toán COD'}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Thanh toán:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getPaymentStatusClass(detailOrder.paymentStatus)}`}>
                      {statusTranslations[detailOrder.paymentStatus] || detailOrder.paymentStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Trạng thái vận chuyển:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getOrderStatusClass(detailOrder.orderStatus)}`}>
                      {statusTranslations[detailOrder.orderStatus] || detailOrder.orderStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items List */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Danh sách sản phẩm mua</h4>
              <div className="bg-slate-950 rounded-2xl border border-slate-850 overflow-hidden divide-y divide-slate-850">
                {detailOrder.items?.map((item: any, idx: number) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between gap-4 text-xs">
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate max-w-[320px]">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                        Số lượng: <span className="text-white font-bold">{item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-extrabold text-slate-200">{formatPrice(item.price)}</div>
                      <div className="font-bold text-purple-400 mt-0.5">Tạm tính: {formatPrice(item.price * item.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 text-xs font-semibold text-slate-300 space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Phí giao hàng:</span>
                <span>{detailOrder.shippingFee > 0 ? formatPrice(detailOrder.shippingFee) : 'Miễn phí'}</span>
              </div>
              {detailOrder.discountAmount > 0 && (
                <div className="flex justify-between text-rose-400">
                  <span className="text-slate-500">Giảm giá áp dụng ({detailOrder.couponApplied}):</span>
                  <span>-{formatPrice(detailOrder.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-850">
                <span className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-purple-500" /> Tổng cộng thực thanh toán:</span>
                <span className="text-purple-400 text-base">{formatPrice(detailOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-850">
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-extrabold rounded-xl text-xs transition-colors border-0 cursor-pointer"
              >
                Đóng lại
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDetailOpen(false);
                  handleOpenEditModal(detailOrder);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition-colors border-0 shadow-lg shadow-purple-550/15 cursor-pointer"
              >
                Cập nhật trạng thái
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-6 shadow-2xl relative">
            <div className="border-b border-slate-850 pb-3">
              <h3 className="text-base font-extrabold text-white">
                Cập nhật trạng thái đơn: {selectedOrder.orderCode}
              </h3>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Trạng thái vận chuyển
                </label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-955 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200"
                >
                  <option value="Pending">Chờ xử lý (Pending)</option>
                  <option value="Confirmed">Đã xác nhận (Confirmed)</option>
                  <option value="Processing">Đang chuẩn bị (Processing)</option>
                  <option value="Shipping">Đang giao hàng (Shipping)</option>
                  <option value="Delivered">Đã giao hàng thành công (Delivered)</option>
                  <option value="Cancelled">Đã hủy đơn (Cancelled)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Trạng thái thanh toán
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-955 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200"
                >
                  <option value="Pending">Chờ thanh toán (Pending)</option>
                  <option value="Paid">Đã thanh toán thành công (Paid)</option>
                  <option value="Failed">Thanh toán thất bại (Failed)</option>
                </select>
              </div>

              {orderStatus === 'Cancelled' && (
                <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-xl text-red-400 text-xs font-semibold">
                  ⚠️ Lưu ý: Khi chuyển trạng thái đơn sang 'Đã hủy', hệ thống sẽ tự động hoàn trả số lượng sản phẩm vào tồn kho!
                </div>
              )}

              {/* Actions Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-extrabold rounded-xl text-xs transition-colors border-0 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition-colors border-0 shadow-lg shadow-purple-550/15 flex items-center gap-1.5 cursor-pointer"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
