import api from '../api/axiosInstance';

export const orderService = {
  getMyOrders: async () => {
    return api.get('/orders/my-orders');
  },

  createOrder: async (orderData: any) => {
    return api.post('/orders', orderData);
  },

  cancelOrder: async (orderId: string, reason?: string) => {
    return api.put(`/orders/${orderId}/cancel`, { reason });
  },

  getAllOrders: async () => {
    return api.get('/orders');
  },

  updateOrderStatus: async (orderId: string, payload: { orderStatus?: string; paymentStatus?: string }) => {
    return api.put(`/orders/${orderId}/status`, payload);
  },

  getOrderDetails: async (orderId: string) => {
    return api.get(`/orders/${orderId}?t=${Date.now()}`);
  },

  getQRPayment: async (orderId: string) => {
    return api.get(`/orders/${orderId}/qr-payment?t=${Date.now()}`);
  }
};

export default orderService;
