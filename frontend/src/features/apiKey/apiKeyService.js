import axiosInstance from '../../utils/axiosConfig';

// Create API key
const createApiKey = async (apiKeyData) => {
  const response = await axiosInstance.post('/apikeys', apiKeyData);
  return response.data;
};

// Get user API keys
const getUserApiKeys = async () => {
  const response = await axiosInstance.get('/apikeys');
  return response.data;
};

// Delete API key
const deleteApiKey = async (id) => {
  await axiosInstance.delete(`/apikeys/${id}`);
};

const apiKeyService = {
  createApiKey,
  getUserApiKeys,
  deleteApiKey,
};

export default apiKeyService;