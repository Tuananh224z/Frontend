import api from '../api/axiosInstance';

/**
 * Service gọi API liên quan tới Thanh toán (Payment).
 * Bao gồm: lấy mã QR VietQR cho đơn hàng.
 * (Webhook Casso chạy server-to-server, không gọi từ frontend.)
 */
export const paymentService = {
  // GET /orders/:id/qr-payment — Lấy thông tin QR thanh toán cho 1 đơn hàng
  // Trả về: { orderId, orderCode, totalAmount, bankId, accountNo,
  //           accountName, qrCodeUrl, addInfo }
  getQRPaymentInfo: async (orderId: string) => {
    // Thêm timestamp để tránh cache phía trình duyệt
    return api.get(`/orders/${orderId}/qr-payment?t=${Date.now()}`);
  },
};

export default paymentService;
