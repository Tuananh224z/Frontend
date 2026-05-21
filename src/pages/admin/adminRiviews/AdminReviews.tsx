import { useState, useEffect } from 'react';
import productService from '../../../services/productService';
import { Star, Search, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff, MessageSquare } from 'lucide-react';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

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
                  <th className="px-6 py-4 text-right">Ẩn / Hiện</th>
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
                      {rev.comment}
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

                    {/* Action - Hide/Show */}
                    <td className="px-6 py-4 text-right">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
