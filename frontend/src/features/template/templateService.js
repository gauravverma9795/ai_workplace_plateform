import axiosInstance from '../../utils/axiosConfig';

// Create template
const createTemplate = async (templateData) => {
  const response = await axiosInstance.post('/templates', templateData);
  return response.data;
};

// Get all templates for a workspace
const getWorkspaceTemplates = async (workspaceId) => {
  const response = await axiosInstance.get(`/templates/workspace/${workspaceId}`);
  return response.data;
};

// Get template by ID
const getTemplate = async (id) => {
  const response = await axiosInstance.get(`/templates/${id}`);
  return response.data;
};

// Update template
const updateTemplate = async (id, templateData) => {
  const response = await axiosInstance.put(`/templates/${id}`, templateData);
  return response.data;
};

// Delete template
const deleteTemplate = async (id) => {
  await axiosInstance.delete(`/templates/${id}`);
};

const templateService = {
  createTemplate,
  getWorkspaceTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate,
};

export default templateService;