import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// WhatsApp API
export const whatsappAPI = {
  getQR: async () => {
    const response = await api.get('/whatsapp/qr');
    return response.data;
  },

  getStatus: async () => {
    const response = await api.get('/whatsapp/status');
    return response.data;
  },

  sendMessage: async (groupId: string, message: string) => {
    const response = await api.post('/whatsapp/send-message', {
      groupId,
      message,
    });
    return response.data;
  },
};

// Groups API
export const groupsAPI = {
  getAllGroups: async () => {
    const response = await api.get('/groups');
    return response.data;
  },

  getGroup: async (groupId: string) => {
    const response = await api.get(`/groups/${groupId}`);
    return response.data;
  },

  getGroupStats: async (groupId: string) => {
    const response = await api.get(`/groups/${groupId}/stats`);
    return response.data;
  },
};

export default api;
