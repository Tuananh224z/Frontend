import { useState } from 'react';
import { Search, Eye, ChevronDown, X, MapPin, Phone, Package } from 'lucide-react';

const mockOrders = [
  { id: '#ORD-001', customer: 'Nguyễn Văn A', phone: '0901234567', address: '123 Nguyễn Huệ, Q.1, TP.HCM', product: 'Laptop ASUS ROG G15', qty: 1, total: 59990000, date: '01/04/2026', status: 'Đang giao', payment: 'Chuyển khoản', note: '' },
  { id: '#ORD-002', customer: 'Trần Thị B', phone: '0912345678', address: '45 Lê Lợi, Q.3, TP.HCM', product: 'Chuột Logitech G Pro X2', qty: 1, total: 2790000, date: '01/04/2026', status: 'Hoàn thành', payment: 'COD', note: '' },
  { id: '#ORD-003', customer: 'Lê Văn C', phone: '0923456789', address: '67 Trần Duy Hưng, Cầu Giấy, HN', product: 'SSD Samsung 990 Pro 2TB', qty: 2, total: 3190000, date: '31/03/2026', status: 'Chờ xử lý', payment: 'MoMo', note: 'Giao giờ hành chính' },
  { id: '#ORD-004', customer: 'Phạm Thị D', phone: '0934567890', address: '89 Láng Hạ, Đống Đa, HN', product: 'MacBook Pro M3 16"', qty: 1, total: 69990000, date: '30/03/2026', status: 'Hoàn thành', payment: 'Thẻ tín dụng', note: '' },
  { id: '#ORD-005', customer: 'Hoàng Văn E', phone: '0945678901', address: '12 Đinh Tiên Hoàng, Q.Bình Thạnh', product: 'Màn hình LG 27" 4K', qty: 1, total: 18990000, date: '29/03/2026', status: 'Đã huỷ', payment: 'COD', note: '' },
  { id: '#ORD-006', customer: 'Đỗ Thị F', phone: '0956789012', address: '34 Tô Hiệu, Tân Phú, TP.HCM', product: 'RAM Corsair DDR5 32GB', qty: 1, total: 2390000, date: '29/03/2026', status: 'Đang giao', payment: 'ZaloPay', note: '' },
  { id: '#ORD-007', customer: 'Bùi Văn G', phone: '0967890123', address: '56 Trường Chinh, Thanh Xuân, HN', product: 'Bàn phím Keychron Q1 Pro', qty: 1, total: 3490000, date: '28/03/2026', status: 'Hoàn thành', payment: 'VNPay', note: '' },
];

const statusColor: Record<string, string> = {
  'Chờ xử lý':  'bg-yellow-100 text-yellow-700',
  'Đang giao':  'bg-blue-100 text-blue-700',
  'Hoàn thành': 'bg-green-100 text-green-700',
  'Đã huỷ':     'bg-red-100 text-red-700',
};

const allStatuses = ['Chờ xử lý', 'Đang giao', 'Hoàn thành', 'Đã huỷ'];

type Order = typeof mockOrders[0];

const OrderDetailModal = ({ order, onClose }: { order: Order; onClose: () => void }) => {
  const [status, setStatus] = useState(order.status);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-extrabold text-gray-900 text-lg">{order.id}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{order.date} · {order.payment}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Customer */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Khách hàng</p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="font-semibold text-gray-900">{order.customer}</p>
              <p className="text-sm text-gray-600 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{order.phone}</p>
              <p className="text-sm text-gray-600 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{order.address}</p>
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Sản phẩm</p>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{order.product}</p>
                <p className="text-xs text-gray-500">SL: {order.qty}</p>
              </div>
              <p className="font-bold text-gray-900 shrink-0">{order.total.toLocaleString('vi-VN')}₫</p>
            </div>
          </div>

          {/* Note */}
          {order.note && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Ghi chú</p>
              <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3">{order.note}</p>
            </div>
          )}

          {/* Status update */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Cập nhật trạng thái</p>
            <div className="grid grid-cols-2 gap-2">
              {allStatuses.map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${status === s ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-700 hover:border-gray-400'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Đóng</button>
          <button onClick={onClose} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors">Lưu thay đổi</button>
        </div>
      </div>
    </div>
  );
};

const AdminOrders = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = mockOrders
    .filter(o => statusFilter === 'all' || o.status === statusFilter)
    .filter(o => o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search));

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Quản lý đơn hàng</h1>
        <p className="text-sm text-gray-500 mt-0.5">{filtered.length} đơn hàng</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'Chờ xử lý', 'Đang giao', 'Hoàn thành', 'Đã huỷ'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${statusFilter === s ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
            {s === 'all' ? 'Tất cả' : s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm mã đơn, khách hàng..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-full focus:ring-1 focus:ring-primary-500 outline-none" />
          </div>
          <button className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 hover:border-gray-400">
            Ngày <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Mã đơn', 'Khách hàng', 'Sản phẩm', 'Thanh toán', 'Tổng tiền', 'Ngày đặt', 'Trạng thái', 'Thao tác'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-bold text-gray-700">{o.id}</td>
                  <td className="px-5 py-3"><p className="font-medium text-gray-900">{o.customer}</p><p className="text-xs text-gray-400">{o.phone}</p></td>
                  <td className="px-5 py-3 text-gray-600 max-w-[180px] truncate">{o.product}</td>
                  <td className="px-5 py-3 text-gray-600">{o.payment}</td>
                  <td className="px-5 py-3 font-bold text-gray-900 whitespace-nowrap">{o.total.toLocaleString('vi-VN')}₫</td>
                  <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{o.date}</td>
                  <td className="px-5 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusColor[o.status]}`}>{o.status}</span></td>
                  <td className="px-5 py-3">
                    <button onClick={() => setSelected(o)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"><Eye className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <OrderDetailModal order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default AdminOrders;
