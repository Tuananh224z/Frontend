import { useState, useEffect } from 'react';
import productService from '../../services/productService';
import { Star, Search, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff, MessageSquare, X } from 'lucide-react';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  // Reply Modal States
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await productService.getReviews();
      if (response.data?.status === 'success') {
        setReviews(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Không thể tải danh sách đánh giá');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleStatus = async (review: any) => {
    try {
      setActionId(review._id);
      setError('');
      setSuccess('');
      const nextStatus = !review.isActive;
      const response = await productService.updateReviewStatus(review._id, nextStatus);

      if (response.data?.status === 'success') {
        setSuccess(`Đã ${nextStatus ? 'hiển thị lại' : 'ẩn'} đánh giá thành công!`);
        fetchReviews();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Cập nhật trạng thái đánh giá thất bại');
    } finally {
      setActionId(null);
    }
  };

  const handleOpenReplyModal = (rev: any) => {
    setSelectedReview(rev);
    setAdminReplyText(rev.adminReply || '');
    setIsReplyModalOpen(true);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview) return;
    if (!adminReplyText.trim()) {
      setError('Vui lòng nhập nội dung phản hồi');
      return;
    }

    try {
      setIsReplying(true);
      setError('');
      setSuccess('');
      const response = await productService.replyReview(selectedReview._id, adminReplyText);

      if (response.data?.status === 'success') {
        setSuccess('Phản hồi đánh giá thành công!');
        setIsReplyModalOpen(false);
        fetchReviews();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Gửi phản hồi thất bại');
    } finally {
      setIsReplying(false);
    }
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

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      (review.user?.fullName && review.user.fullName.toLowerCase().includes(search.toLowerCase())) ||
      (review.product?.name && review.product.name.toLowerCase().includes(search.toLowerCase())) ||
      (review.comment && review.comment.toLowerCase().includes(search.toLowerCase()));

    const matchesRating = ratingFilter === 'All' || review.rating.toString() === ratingFilter;
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && review.isActive) ||
      (statusFilter === 'Hidden' && !review.isActive);

    return matchesSearch && matchesRating && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm theo sản phẩm, người đánh giá, nội dung..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đánh giá:</span>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:border-purple-500 focus:outline-hidden"
            >
              <option value="All">Tất cả sao</option>
              <option value="5">5 Sao ⭐⭐⭐⭐⭐</option>
              <option value="4">4 Sao ⭐⭐⭐⭐</option>
              <option value="3">3 Sao ⭐⭐⭐</option>
              <option value="2">2 Sao ⭐⭐</option>
              <option value="1">1 Sao ⭐</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:border-purple-500 focus:outline-hidden"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Active">Hiển thị</option>
              <option value="Hidden">Đang ẩn</option>
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

      {/* Reviews Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800/80 text-slate-400 font-semibold text-sm">
          <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          Không tìm thấy đánh giá nào từ khách hàng
        </div>
      ) : (
        <div className="bg-slate-900 rounded-3xl border border-slate-800/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-450 font-bold bg-slate-900/50">
                  <th className="px-6 py-4">Sản phẩm</th>
                  <th className="px-6 py-4">Người đánh giá</th>
                  <th className="px-6 py-4">Số sao</th>
                  <th className="px-6 py-4">Nội dung bình luận</th>
                  <th className="px-6 py-4">Ngày đánh giá</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredReviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-slate-850/40 transition-colors text-sm">
                    {/* Product Name */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-white max-w-[200px] truncate" title={rev.product?.name}>
                        {rev.product?.name || 'Sản phẩm đã bị xóa'}
                      </div>
                      {rev.product?.slug && (
                        <span className="text-[10px] text-purple-400 font-bold">/{rev.product.slug}</span>
                      )}
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200">{rev.user?.fullName || 'Khách hàng ẩn'}</div>
                      <div className="text-xs text-slate-450">{rev.user?.email || 'N/A'}</div>
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-700'
                              }`}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Comment */}
                    <td className="px-6 py-4 text-xs font-medium text-slate-300 max-w-sm whitespace-normal break-words">
                      <div>{rev.comment}</div>
                      {rev.adminReply && (
                        <div className="mt-2 p-2 bg-slate-950/50 rounded-lg border border-slate-800 text-[11px]">
                          <span className="text-purple-400 font-bold">Phản hồi của Admin: </span>
                          <span className="text-slate-400 font-medium">{rev.adminReply}</span>
                          <span className="text-[9px] text-slate-500 font-medium block mt-1">
                            {formatDate(rev.adminRepliedAt || rev.updatedAt)}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs font-semibold text-slate-450">{formatDate(rev.createdAt)}</td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border ${rev.isActive
                          ? 'text-emerald-400 bg-emerald-950/20 border-emerald-900/40'
                          : 'text-red-400 bg-red-950/20 border-red-900/40'
                        }`}>
                        {rev.isActive ? 'Hiển thị' : 'Đang ẩn'}
                      </span>
                    </td>

                    {/* Action - Reply & Hide/Show */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenReplyModal(rev)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-800 hover:border-purple-900 text-purple-400 hover:bg-purple-950/20 bg-slate-900 cursor-pointer select-none"
                          title="Phản hồi đánh giá"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{rev.adminReply ? 'Sửa PH' : 'Phản hồi'}</span>
                        </button>
                        <button
                          disabled={actionId === rev._id}
                          onClick={() => handleToggleStatus(rev)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer select-none border-slate-800 hover:border-purple-900 ${rev.isActive
                              ? 'text-red-400 hover:bg-red-950/20 bg-slate-900'
                              : 'text-emerald-400 hover:bg-emerald-950/20 bg-slate-900'
                            }`}
                          title={rev.isActive ? 'Ẩn bình luận vi phạm' : 'Kích hoạt lại hiển thị'}
                        >
                          {rev.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{rev.isActive ? 'Ẩn đi' : 'Hiển thị'}</span>
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

      {/* Reply Modal */}
      {isReplyModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-6 shadow-2xl relative">
            <div className="border-b border-slate-850 pb-3 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white">
                Phản hồi đánh giá sản phẩm
              </h3>
              <button
                onClick={() => setIsReplyModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors bg-transparent border-0 cursor-pointer p-1 rounded-lg hover:bg-slate-850 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs text-slate-350">
                <div className="flex justify-between font-bold mb-1 text-slate-400">
                  <span>Khách hàng: {selectedReview.user?.fullName || 'Khách hàng ẩn'}</span>
                  <span>⭐ {selectedReview.rating}/5</span>
                </div>
                <p className="italic text-slate-400 font-medium">"{selectedReview.comment}"</p>
              </div>

              <form onSubmit={handleSendReply} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Nội dung phản hồi từ TechStore <span className="text-purple-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    placeholder="Cảm ơn bạn đã phản hồi về sản phẩm..."
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200 resize-none"
                  />
                </div>

                {/* Actions Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-850">
                  <button
                    type="button"
                    onClick={() => setIsReplyModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-extrabold rounded-xl text-xs transition-colors border-0 cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isReplying || !adminReplyText.trim()}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition-colors border-0 shadow-lg shadow-purple-550/15 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isReplying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Gửi phản hồi'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
