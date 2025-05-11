import axiosInstance from '../../utils/axiosConfig';

// Create workspace
const createWorkspace = async (workspaceData) => {
  const response = await axiosInstance.post('/workspaces', workspaceData);
  return response.data;
};

// Get user workspaces
const getUserWorkspaces = async () => {
  const response = await axiosInstance.get('/workspaces');
  return response.data;
};

// Get workspace by ID
const getWorkspace = async (id) => {
  const response = await axiosInstance.get(`/workspaces/${id}`);
  return response.data;
};

// Update workspace
const updateWorkspace = async (id, workspaceData) => {
  const response = await axiosInstance.put(`/workspaces/${id}`, workspaceData);
  return response.data;
};

// Delete workspace
const deleteWorkspace = async (id) => {
  await axiosInstance.delete(`/workspaces/${id}`);
};

const workspaceService = {
  createWorkspace,
  getUserWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
};

export default workspaceService;