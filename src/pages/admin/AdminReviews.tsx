import { useState } from 'react';
import { Star, Check, Trash2, Search, MessageSquare, X, XCircle } from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

type Review = typeof mockReviews[0];

const mockReviews = [
  { id: 1, user: 'Nguyễn Văn A', product: 'Laptop ASUS ROG G15', rating: 5, comment: 'Máy mạnh, chạy game cực mượt. Pin trâu hơn mình nghĩ. Màn hình đẹp, màu sắc chân thực!', date: '20/03/2026', status: 'Đã duyệt', avatar: 'NA', reply: '' },
  { id: 2, user: 'Trần Thị B', product: 'MacBook Pro M3 Pro', rating: 4, comment: 'Hiệu năng siêu đỉnh nhưng giá hơi cao. Màn hình đẹp xuất sắc. Rất hài lòng về trải nghiệm tổng thể.', date: '19/03/2026', status: 'Chờ duyệt', avatar: 'TB', reply: '' },
  { id: 3, user: 'Lê Văn C', product: 'Chuột Logitech G Pro X2', rating: 5, comment: 'Chuột siêu nhẹ, click cực chắc. Sensor ổn định. Đáng tiền lắm!', date: '18/03/2026', status: 'Đã duyệt', avatar: 'LC', reply: 'Cảm ơn bạn đã tin tưởng TechStore! Chúc bạn trải nghiệm vui vẻ 🎉' },
  { id: 4, user: 'Phạm D', product: 'SSD Samsung 990 Pro 2TB', rating: 3, comment: 'Tốc độ nhẹ hơn so với quảng cáo. Nhưng vẫn ổn hơn SSD cũ nhiều.', date: '17/03/2026', status: 'Chờ duyệt', avatar: 'PD', reply: '' },
  { id: 5, user: 'Hoàng E', product: 'Bàn phím Keychron Q1 Pro', rating: 5, comment: 'Build quality cực kỳ chắc chắn. Âm thanh gõ rất dễ chịu. Gasket mount êm tuyệt vời!', date: '16/03/2026', status: 'Đã duyệt', avatar: 'HE', reply: '' },
  { id: 6, user: 'Vũ F', product: 'RAM Corsair DDR5 32GB', rating: 2, comment: 'Hàng giao bị bong góc hộp. Nhưng RAM hoạt động bình thường.', date: '15/03/2026', status: 'Từ chối', avatar: 'VF', reply: '' },
];

const statusColor: Record<string, string> = {
  'Đã duyệt': 'bg-green-100 text-green-700',
  'Chờ duyệt': 'bg-yellow-100 text-yellow-700',
  'Từ chối':   'bg-red-100 text-red-700',
};

const StarRow = ({ n }: { n: number }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => <Star key={i} className={`w-3.5 h-3.5 ${i <= n ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />)}
  </div>
);

/* ─── Reply Modal ─── */
const ReplyModal = ({ review, onClose }: { review: Review; onClose: () => void }) => {
  const [text, setText] = useState(review.reply ?? '');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-extrabold text-gray-900">Trả lời đánh giá</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-6 space-y-4">
          {/* Original review */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-xs">{review.avatar}</div>
              <span className="font-semibold text-gray-900 text-sm">{review.user}</span>
              <StarRow n={review.rating} />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Nội dung trả lời *</label>
            <textarea
              rows={4}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Nhập phản hồi của shop đến khách hàng..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Huỷ</button>
          <button disabled={!text.trim()} onClick={onClose} className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4" /> Gửi trả lời
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Approve Modal ─── */
const ApproveModal = ({ review, onClose }: { review: Review; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="font-extrabold text-gray-900">Duyệt đánh giá</h2>
        <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <p className="text-center text-gray-700 text-sm">Xác nhận duyệt đánh giá của <strong>{review.user}</strong> về <strong>{review.product}</strong>?</p>
        <p className="text-center text-xs text-gray-400 mt-1">Đánh giá sẽ hiển thị công khai trên trang sản phẩm.</p>
      </div>
      <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
        <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700">Huỷ</button>
        <button onClick={onClose} className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-2.5 text-sm font-semibold">✓ Duyệt</button>
      </div>
    </div>
  </div>
);

/* ─── Main ─── */
const AdminReviews = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [replyTarget, setReplyTarget] = useState<Review | null>(null);
  const [approveTarget, setApproveTarget] = useState<Review | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);

  const filtered = mockReviews
    .filter(r => filter === 'all' || r.status === filter)
    .filter(r => r.user.toLowerCase().includes(search.toLowerCase()) || r.product.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Quản lý đánh giá</h1>
        <p className="text-sm text-gray-500 mt-0.5">{filtered.length} đánh giá</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'Chờ duyệt', 'Đã duyệt', 'Từ chối'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${filter === s ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
            {s === 'all' ? 'Tất cả' : s}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo user, sản phẩm..."
          className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-full focus:ring-1 focus:ring-primary-500 outline-none" />
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map(r => (
          <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">{r.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-semibold text-gray-900">{r.user}</p>
                      <p className="text-xs text-gray-500 mt-0.5">về <span className="text-primary-600 font-medium">{r.product}</span> · {r.date}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusColor[r.status]}`}>{r.status}</span>
                  </div>
                  <div className="mt-2"><StarRow n={r.rating} /></div>
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">{r.comment}</p>
                </div>
              </div>

              {/* Shop reply (if exists) */}
              {r.reply && (
                <div className="mt-3 ml-14 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                  <p className="text-xs font-bold text-blue-600 mb-1">💬 Phản hồi từ Shop</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{r.reply}</p>
                </div>
              )}
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-t border-gray-100 flex-wrap">
              {r.status !== 'Đã duyệt' && (
                <button onClick={() => setApproveTarget(r)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg transition-colors">
                  <Check className="w-3.5 h-3.5" /> Duyệt
                </button>
              )}
              <button onClick={() => setReplyTarget(r)}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors">
                <MessageSquare className="w-3.5 h-3.5" /> {r.reply ? 'Sửa trả lời' : 'Trả lời'}
              </button>
              {r.status === 'Chờ duyệt' && (
                <button
                  className="flex items-center gap-1.5 text-xs font-semibold text-orange-700 hover:bg-orange-100 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg transition-colors">
                  <XCircle className="w-3.5 h-3.5" /> Từ chối
                </button>
              )}
              <button onClick={() => setDeleteTarget(r)}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg transition-colors ml-auto">
                <Trash2 className="w-3.5 h-3.5" /> Xoá
              </button>
            </div>
          </div>
        ))}
      </div>

      {replyTarget   && <ReplyModal   review={replyTarget}   onClose={() => setReplyTarget(null)} />}
      {approveTarget && <ApproveModal review={approveTarget} onClose={() => setApproveTarget(null)} />}
      {deleteTarget  && <DeleteConfirmModal title="Xóa đánh giá" message={`Xác nhận xóa đánh giá của "${deleteTarget.user}"?`} onConfirm={() => {}} onClose={() => setDeleteTarget(null)} />}
    </div>
  );
};

export default AdminReviews;
