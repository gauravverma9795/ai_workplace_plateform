// Format date to readable format
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Get user role in workspace
export const getUserRole = (workspace, userId) => {
  if (!workspace || !userId) return null;
  
  if (workspace.owner === userId) return 'owner';
  
  const member = workspace.members.find((m) => m.userId === userId);
  return member ? member.role : null;
};

// Check if user can perform action based on role
export const canPerformAction = (userRole, requiredRoles) => {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
};

// Generate random hex color based on string
export const stringToColor = (str) => {
  if (!str) return '#6366F1'; // Default color
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
};