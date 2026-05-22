import { useState, useEffect } from 'react';
import { Star, Loader2, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import productService from '../../../services/productService';
import orderService from '../../../services/orderService';
import { Link } from 'react-router-dom';

interface ProductReviewsProps {
  productId: string;
}

interface ReviewType {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    avatar?: string;
  } | null;
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
  adminReply?: string;
  adminRepliedAt?: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await productService.getProductReviews(productId);
      if (res.data?.status === 'success') {
        setReviews(res.data.data || []);
      }
    } catch (err) {
      console.error('Lỗi khi tải đánh giá:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
    // Reset form states
    setRating(5);
    setComment('');
    setError('');
    setSuccess('');
  }, [productId, user]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Vui lòng nhập bình luận đánh giá.');
      return;
    }
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const res = await productService.createReview({
        product: productId,
        rating,
        comment: comment.trim(),
      });

      if (res.data?.status === 'success' || res.data?.data) {
        setSuccess('Đăng đánh giá của bạn thành công!');
        setComment('');
        setRating(5);
        // Tải lại danh sách đánh giá mới nhất
        fetchReviews();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Đăng đánh giá thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  // Tính toán số liệu thống kê
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '0';

  const ratingCounts = [0, 0, 0, 0, 0]; // 1 sao đến 5 sao
  reviews.forEach(r => {
    const starIdx = Math.round(r.rating) - 1;
    if (starIdx >= 0 && starIdx < 5) {
      ratingCounts[starIdx]++;
    }
  });

  // Kiểm tra xem user hiện tại đã đánh giá chưa
  const hasAlreadyReviewed = user && reviews.some(r => r.user?._id === user._id);

  // Avatar helper
  const getAvatarLetter = (name: string) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 p-6 sm:p-8 shadow-xs mt-8 text-left">
      <h3 className="text-lg font-extrabold text-slate-900 mb-6">
        Đánh giá sản phẩm
      </h3>

      {/* Summary Section */}
      <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-12 mb-6">
        {/* Left: Overall rating score */}
        <div className="flex flex-col items-center justify-center shrink-0 w-32">
          <span className="text-5xl font-black text-slate-900 leading-none">
            {averageRating}
          </span>
          <div className="flex items-center gap-0.5 my-2">
            {[...Array(5)].map((_, i) => {
              const starVal = i + 1;
              const isFilled = starVal <= Math.round(parseFloat(averageRating));
              return (
                <Star 
                  key={i} 
                  className={`w-4.5 h-4.5 ${isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-250 text-slate-200'}`} 
                />
              );
            })}
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {totalReviews} đánh giá
          </span>
        </div>

        {/* Right: Breakdown list */}
        <div className="flex-1 w-full max-w-xl flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star - 1];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 w-full">
                <span className="text-xs font-bold text-slate-500 w-3 text-right">{star}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-slate-400 w-4 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 my-6"></div>

      {/* Write a Review Section */}
      <div className="mb-8">
        {!user ? (
          <div className="p-4 bg-amber-50/40 border border-dashed border-amber-200 rounded-2xl flex items-center justify-center text-sm text-amber-700 font-semibold">
            Vui lòng&nbsp;
            <Link to="/login" className="text-amber-800 hover:text-amber-950 underline font-extrabold transition-colors">
              Đăng nhập
            </Link>
            &nbsp;để viết đánh giá cho sản phẩm này.
          </div>
        ) : hasAlreadyReviewed ? (
          <div className="p-4 bg-emerald-50/40 border border-dashed border-emerald-200 rounded-2xl flex items-center justify-center text-sm text-emerald-700 font-semibold">
            Bạn đã gửi đánh giá cho sản phẩm này rồi. Cảm ơn phản hồi của bạn!
          </div>
        ) : (
          /* Review Submission Form */
          <form onSubmit={handleSubmitReview} className="bg-slate-50/50 border border-slate-150 rounded-2xl p-5 space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm">Viết đánh giá của bạn</h4>
            
            {error && (
              <div className="flex items-center gap-1.5 p-3 bg-red-50 text-red-650 text-xs font-semibold rounded-xl border border-red-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-1.5 p-3 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-xl border border-emerald-150 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Stars selection */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Đánh giá của bạn:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isFilled = starVal <= rating;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setRating(starVal)}
                      className="p-0.5 hover:scale-110 transition-transform cursor-pointer border-0 bg-transparent focus:outline-hidden"
                    >
                      <Star 
                        className={`w-6 h-6 ${isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment textarea */}
            <div className="space-y-1.5">
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Nhập nhận xét chi tiết của bạn về chất lượng sản phẩm, chế độ giao hàng và dịch vụ..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-hidden text-sm font-semibold text-slate-800 resize-none shadow-2xs"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !comment.trim()}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-750 text-white font-extrabold rounded-xl text-xs transition-colors border-0 cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-200/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                Gửi đánh giá
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Reviews List Section */}
      <div className="space-y-6">
        <h4 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-2">
          Nhận xét từ khách hàng ({totalReviews})
        </h4>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="p-4 bg-slate-50 text-slate-300 rounded-2xl border border-slate-100">
              <MessageSquare className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium text-slate-400">Chưa có đánh giá nào cho sản phẩm này.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reviews.map((rev) => {
              const reviewerName = rev.user?.fullName || 'Khách hàng TechStore';
              const reviewerAvatar = rev.user?.avatar;
              const formattedDate = new Date(rev.createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });

              return (
                <div key={rev._id} className="py-5 first:pt-0 last:pb-0 flex gap-4 text-left">
                  {/* User Avatar */}
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center shrink-0 border border-purple-200/60 overflow-hidden text-sm uppercase">
                    {reviewerAvatar ? (
                      <img 
                        src={reviewerAvatar.startsWith('http') ? reviewerAvatar : `http://localhost:5000${reviewerAvatar.startsWith('/') ? '' : '/'}${reviewerAvatar}`} 
                        alt={reviewerName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    <span>{getAvatarLetter(reviewerName)}</span>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h5 className="font-extrabold text-slate-800 text-sm leading-tight">
                        {reviewerName}
                      </h5>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {formattedDate}
                      </span>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, idx) => {
                        const starVal = idx + 1;
                        const isFilled = starVal <= rev.rating;
                        return (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                          />
                        );
                      })}
                    </div>

                    {/* Comment text */}
                    <p className="text-sm font-semibold text-slate-650 leading-relaxed whitespace-pre-line pr-2">
                      {rev.comment}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
