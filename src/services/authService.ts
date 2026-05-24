import api from '../api/axiosInstance';

export const authService = {
  getMe: async () => {
    return api.get('/auth/me');
  },

  getProfile: async () => {
    return api.get('/auth/profile');
  },

  login: async (credentials: { email: string; password?: string }) => {
    return api.post('/auth/login', credentials);
  },

  register: async (userData: any) => {
    return api.post('/auth/register', userData);
  },

  updateProfile: async (profileData: any) => {
    return api.put('/auth/profile', profileData);
  },

  changePassword: async (passwordData: any) => {
    return api.put('/auth/change-password', passwordData);
  },


  // Admin User APIs
  getUsers: async () => {
    return api.get('/users');
  },

  createUserAdmin: async (userData: any) => {
    return api.post('/users', userData);
  },

  toggleUserLock: async (userId: string) => {
    return api.put(`/users/${userId}/toggle-lock`);
  },

  updateUserRole: async (userId: string, role: string) => {
    return api.put(`/users/${userId}/role`, { role });
  }
};

export default authService;
