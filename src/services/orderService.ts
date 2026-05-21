import api from './api';

export const orderService = {
  getMyOrders: async () => {
    return api.get('/orders/my-orders');
  },

  cancelOrder: async (orderId: string, reason?: string) => {
    return api.put(`/orders/${orderId}/cancel`, { reason });
  },

  getAllOrders: async () => {
    return api.get('/orders');
  },

  updateOrderStatus: async (orderId: string, payload: { orderStatus?: string; paymentStatus?: string }) => {
    return api.put(`/orders/${orderId}/status`, payload);
  }
};

export default orderService;
