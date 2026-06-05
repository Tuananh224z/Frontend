import { useState, useEffect } from 'react';
import orderService from '../../services/orderService';
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
      const response = await orderService.getAllOrders();
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

      const response = await orderService.updateOrderStatus(selectedOrder._id, {
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
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Confirmed':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Processing':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'Shipping':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Delivered':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Cancelled':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Pending':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Failed':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200';
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
    <div className="space-y-6 text-left">
      {/* Search and Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm mã đơn, tên, email, sđt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-800"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:border-purple-500 focus:outline-hidden cursor-pointer"
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
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thanh toán:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:border-purple-500 focus:outline-hidden cursor-pointer"
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
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 text-sm font-semibold rounded-xl border border-emerald-250 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 text-sm font-semibold rounded-xl border border-red-250 animate-in fade-in duration-200">
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
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 font-semibold text-sm shadow-xs animate-in fade-in duration-200">
          <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          Không tìm thấy đơn hàng nào
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs animate-in fade-in duration-205">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold bg-slate-50/75">
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
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors text-sm">
                    {/* Order Code */}
                    <td className="px-6 py-4 font-extrabold text-slate-900">{order.orderCode}</td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="min-w-[150px]">
                        <div className="font-bold text-slate-800">{order.user?.fullName || order.shippingAddress?.fullName}</div>
                        <div className="text-xs text-slate-500">{order.user?.email || 'N/A'}</div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs font-semibold text-slate-600">{formatDate(order.createdAt)}</td>

                    {/* Payment Method */}
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">
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
                    <td className="px-6 py-4 font-extrabold text-purple-600">{formatPrice(order.totalAmount)}</td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setDetailOrder(order);
                            setIsDetailOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4 text-slate-500 hover:text-purple-650" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(order)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
                          title="Cập nhật trạng thái"
                        >
                          <Edit3 className="w-4 h-4 text-slate-500 hover:text-blue-600" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl p-6 space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-purple-600" />
                Chi tiết đơn hàng: {detailOrder.orderCode}
              </h3>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="text-slate-400 hover:text-slate-900 border-0 bg-transparent cursor-pointer font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {/* Customer and Delivery Info */}
              <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-extrabold text-xs text-purple-600 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <User className="w-4.5 h-4.5" /> Thông tin giao hàng
                </h4>
                <div className="space-y-2 text-xs font-semibold text-slate-700">
                  <p><span className="text-slate-500 font-medium">Họ và tên:</span> {detailOrder.shippingAddress?.fullName || detailOrder.user?.fullName}</p>
                  <p><span className="text-slate-500 font-medium">Số điện thoại:</span> {detailOrder.shippingAddress?.phone || detailOrder.user?.phone || 'N/A'}</p>
                  <p><span className="text-slate-500 font-medium">Email khách:</span> {detailOrder.user?.email || 'N/A'}</p>
                  <p>
                    <span className="text-slate-500 font-medium">Địa chỉ:</span>{' '}
                    {detailOrder.shippingAddress?.street}, {detailOrder.shippingAddress?.ward}, {detailOrder.shippingAddress?.district}, {detailOrder.shippingAddress?.city}
                  </p>
                  {detailOrder.notes && (
                    <p className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] font-medium mt-2">
                      <span className="font-bold block text-slate-700 mb-0.5">Ghi chú từ khách:</span>
                      {detailOrder.notes}
                    </p>
                  )}
                  {detailOrder.cancelledReason && (
                    <p className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[11px] font-medium mt-2">
                      <span className="font-bold block text-red-800 mb-0.5">Lý do hủy đơn:</span>
                      {detailOrder.cancelledReason}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment and Process status */}
              <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-extrabold text-xs text-purple-600 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Calendar className="w-4.5 h-4.5" /> Trạng thái đơn hàng
                </h4>
                <div className="space-y-3 text-xs font-semibold text-slate-700">
                  <p><span className="text-slate-500 font-medium">Ngày đặt hàng:</span> {formatDate(detailOrder.createdAt)}</p>
                  <p><span className="text-slate-500 font-medium">Phương thức thanh toán:</span> {detailOrder.paymentMethod === 'Online' ? 'Chuyển khoản trực tuyến' : 'Thanh toán COD'}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Thanh toán:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getPaymentStatusClass(detailOrder.paymentStatus)}`}>
                      {statusTranslations[detailOrder.paymentStatus] || detailOrder.paymentStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Trạng thái vận chuyển:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getOrderStatusClass(detailOrder.orderStatus)}`}>
                      {statusTranslations[detailOrder.orderStatus] || detailOrder.orderStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items List */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">Danh sách sản phẩm mua</h4>
              <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-200">
                {detailOrder.items?.map((item: any, idx: number) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between gap-4 text-xs">
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 truncate max-w-[320px]">{item.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                        Số lượng: <span className="text-slate-800 font-bold">{item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-extrabold text-slate-900">{formatPrice(item.price)}</div>
                      <div className="font-bold text-purple-600 mt-0.5">Tạm tính: {formatPrice(item.price * item.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Phí giao hàng:</span>
                <span className="text-slate-800">{detailOrder.shippingFee > 0 ? formatPrice(detailOrder.shippingFee) : 'Miễn phí'}</span>
              </div>
              {detailOrder.discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span className="text-slate-500">Giảm giá áp dụng ({detailOrder.couponApplied}):</span>
                  <span>-{formatPrice(detailOrder.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-purple-600" /> Tổng cộng thực thanh toán:</span>
                <span className="text-purple-600 text-base font-black">{formatPrice(detailOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs transition-colors border border-slate-200 cursor-pointer"
              >
                Đóng lại
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDetailOpen(false);
                  handleOpenEditModal(detailOrder);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition-colors border-0 shadow-md shadow-purple-600/15 cursor-pointer"
              >
                Cập nhật trạng thái
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-6 shadow-2xl relative">
            <div className="border-b border-slate-150 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Cập nhật trạng thái đơn: {selectedOrder.orderCode}
              </h3>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Trạng thái vận chuyển
                </label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-800 cursor-pointer"
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
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Trạng thái thanh toán
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-800 cursor-pointer"
                >
                  <option value="Pending">Chờ thanh toán (Pending)</option>
                  <option value="Paid">Đã thanh toán thành công (Paid)</option>
                  <option value="Failed">Thanh toán thất bại (Failed)</option>
                </select>
              </div>

              {orderStatus === 'Cancelled' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                  ⚠️ Lưu ý: Khi chuyển trạng thái đơn sang 'Đã hủy', hệ thống sẽ tự động hoàn trả số lượng sản phẩm vào tồn kho!
                </div>
              )}

              {/* Actions Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs transition-colors border border-slate-200 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition-colors border-0 shadow-md shadow-purple-600/15 flex items-center gap-1.5 cursor-pointer"
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
