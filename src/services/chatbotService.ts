import api from '../api/axiosInstance';

export const chatbotService = {
  getChatSessions: async () => {
    return api.get('/chat/sessions');
  },

  getPopularQuestions: async () => {
    return api.get('/chat/popular-questions');
  },

  getSessionMessages: async (sessionToken: string) => {
    return api.get(`/chat/sessions/${sessionToken}/messages`);
  },

  getSystemSettings: async () => {
    return api.get('/system/settings');
  },

  updateSystemSettings: async (payload: any) => {
    return api.put('/system/settings', payload);
  },

  getStatsSummary: async () => {
    return api.get('/system/stats/summary');
  },

  getStatsChatbot: async () => {
    return api.get('/system/stats/chatbot');
  },

  getStatsUsers: async () => {
    return api.get('/system/stats/users');
  }
};

export default chatbotService;
