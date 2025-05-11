import axiosInstance from '../../utils/axiosConfig';

// Generate content with AI
const generateContent = async (contentData) => {
  const response = await axiosInstance.post('/content', contentData);
  return response.data;
};

// Get all content for a workspace
const getWorkspaceContent = async (workspaceId) => {
  const response = await axiosInstance.get(`/content/workspace/${workspaceId}`);
  return response.data;
};

// Get content by ID
const getContent = async (id) => {
  const response = await axiosInstance.get(`/content/${id}`);
  return response.data;
};

// Update content
const updateContent = async (id, contentData) => {
  const response = await axiosInstance.put(`/content/${id}`, contentData);
  return response.data;
};

// Delete content
const deleteContent = async (id) => {
  await axiosInstance.delete(`/content/${id}`);
};

const contentService = {
  generateContent,
  getWorkspaceContent,
  getContent,
  updateContent,
  deleteContent,
};

export default contentService;