import api from '../api/axiosInstance';

/**
 * Service gọi API liên quan tới Đánh giá sản phẩm (Review).
 * - Khách hàng: xem, tạo, xóa đánh giá của mình.
 * - Quản trị viên: xem tất cả, ẩn/hiện, gửi phản hồi.
 */
export const reviewService = {
  // ====== Public / Customer ======
  // GET /reviews/product/:productId — Lấy danh sách đánh giá của 1 sản phẩm
  getProductReviews: async (productId: string) => {
    return api.get(`/reviews/product/${productId}`);
  },

  // POST /reviews — Khách hàng gửi đánh giá mới
  createReview: async (payload: { product: string; rating: number; comment: string }) => {
    return api.post('/reviews', payload);
  },

  // DELETE /reviews/:id — Khách hàng tự xóa đánh giá của mình
  deleteReview: async (reviewId: string) => {
    return api.delete(`/reviews/${reviewId}`);
  },

  // ====== Admin ======
  // GET /reviews — Lấy tất cả đánh giá (admin)
  getAllReviews: async () => {
    return api.get('/reviews');
  },

  // PUT /reviews/:id/status — Ẩn/Hiện đánh giá
  updateReviewStatus: async (reviewId: string, isActive: boolean) => {
    return api.put(`/reviews/${reviewId}/status`, { isActive });
  },

  // PUT /reviews/:id/reply — Gửi phản hồi cho đánh giá
  replyReview: async (reviewId: string, adminReply: string) => {
    return api.put(`/reviews/${reviewId}/reply`, { adminReply });
  },
};

export default reviewService;
