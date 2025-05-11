const express = require('express');
const { 
  getTeamMembers,
  getTeamMemberById,
  addTeamMember,
  inviteTeamMember,
  updateTeamMember,
  acceptInvitation,
  resendInvitation
} = require('../controllers/teamController');
const removeTeamMember = require('../controllers/teamMemberRemovalController');
const { requireAuth, loadUser } = require('../middleware/clerkAuth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(requireAuth);
router.use(loadUser);

// Define your routes
router.get('/workspace/:workspaceId', getTeamMembers);
router.post('/invite', inviteTeamMember);
router.put('/accept/:id', acceptInvitation);
router.post('/:id/resend', resendInvitation);
router.post('/', addTeamMember);
router.get('/:id', getTeamMemberById);
router.put('/:id', updateTeamMember);

// Use the dedicated removal controller
router.delete('/:id', removeTeamMember);

module.exports = router;