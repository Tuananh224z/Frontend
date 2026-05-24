import api from '../api/axiosInstance';

/**
 * Service gọi API liên quan tới Cấu hình hệ thống (SystemSettings)
 * và Thống kê (Stats).
 */
export const settingService = {
  // ====== Public ======
  // GET /system/settings — Lấy cấu hình hệ thống (logo, banner, contactInfo, chatbotConfig)
  getSettings: async () => {
    return api.get('/system/settings');
  },

  // ====== Admin ======
  // PUT /system/settings — Cập nhật cấu hình hệ thống
  updateSettings: async (settingsData: any) => {
    return api.put('/system/settings', settingsData);
  },

  // GET /system/stats/summary — Thống kê tổng quan (doanh thu, đơn hàng, khách hàng, top SP)
  getStatsSummary: async () => {
    return api.get('/system/stats/summary');
  },

  // GET /system/stats/chatbot — Thống kê hoạt động chatbot (phiên, feedback, top SP gợi ý)
  getChatbotStats: async () => {
    return api.get('/system/stats/chatbot');
  },

  // GET /system/stats/users — Thống kê đăng ký khách hàng theo tháng
  getUserStats: async () => {
    return api.get('/system/stats/users');
  },
};

export default settingService;
