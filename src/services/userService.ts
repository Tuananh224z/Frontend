import api from '../api/axiosInstance';

/**
 * Service gọi API liên quan tới Quản lý người dùng (Admin only).
 * Khớp với adminRoutes: /users, /users/:id, /users/:id/toggle-lock, /users/:id/role
 */
export const userService = {
  // GET /users — Lấy danh sách tất cả tài khoản
  getAllUsers: async () => {
    return api.get('/users');
  },

  // GET /users/:id — Xem chi tiết 1 tài khoản
  getUserById: async (userId: string) => {
    return api.get(`/users/${userId}`);
  },

  // POST /users — Tạo tài khoản mới (admin tạo)
  createUser: async (userData: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: 'customer' | 'admin';
    address?: any;
  }) => {
    return api.post('/users', userData);
  },

  // PUT /users/:id/toggle-lock — Khóa hoặc mở khóa tài khoản
  toggleUserLock: async (userId: string) => {
    return api.put(`/users/${userId}/toggle-lock`);
  },

  // PUT /users/:id/role — Đổi vai trò (customer ↔ admin)
  updateUserRole: async (userId: string, role: 'customer' | 'admin') => {
    return api.put(`/users/${userId}/role`, { role });
  },
};

export default userService;
