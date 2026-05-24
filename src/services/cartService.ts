import api from '../api/axiosInstance';

/**
 * Service gọi API liên quan tới Giỏ hàng (Cart).
 * Khớp với protectedRoutes: /cart, /cart/:productId
 */
export const cartService = {
  // GET /cart — Lấy giỏ hàng hiện tại của khách
  getCart: async () => {
    return api.get('/cart');
  },

  // POST /cart — Thêm sản phẩm vào giỏ
  addToCart: async (productId: string, quantity: number = 1) => {
    return api.post('/cart', { productId, quantity });
  },

  // PUT /cart — Cập nhật số lượng sản phẩm trong giỏ
  updateCartItem: async (productId: string, quantity: number) => {
    return api.put('/cart', { productId, quantity });
  },

  // DELETE /cart/:productId — Xóa 1 sản phẩm khỏi giỏ
  removeFromCart: async (productId: string) => {
    return api.delete(`/cart/${productId}`);
  },

  // DELETE /cart — Xóa toàn bộ giỏ hàng
  clearCart: async () => {
    return api.delete('/cart');
  },
};

export default cartService;
