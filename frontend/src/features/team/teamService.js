import axiosInstance from '../../utils/axiosConfig';

// Add team member
const addTeamMember = async (workspaceId, memberData) => {
  const response = await axiosInstance.post(`/teams/${workspaceId}`, memberData);
  return response.data;
};

// Get team members
const getTeamMembers = async (workspaceId) => {
  const response = await axiosInstance.get(`/teams/${workspaceId}`);
  return response.data;
};

// Update team member role
const updateTeamMember = async (workspaceId, userId, roleData) => {
  const response = await axiosInstance.put(`/teams/${workspaceId}/${userId}`, roleData);
  return response.data;
};

// Remove team member
const removeTeamMember = async (workspaceId, userId) => {
  await axiosInstance.delete(`/teams/${workspaceId}/${userId}`);
};

const teamService = {
  addTeamMember,
  getTeamMembers,
  updateTeamMember,
  removeTeamMember,
};

export default teamService;