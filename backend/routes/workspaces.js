const express = require('express');
const { 
  createWorkspace,
  getWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace
} = require('../controllers/workspaceController');
const { requireAuth, loadUser } = require('../middleware/clerkAuth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(requireAuth);
router.use(loadUser);

router.route('/')
  .get(getWorkspaces)
  .post(createWorkspace);

router.route('/:id')
  .get(getWorkspace)
  .put(updateWorkspace)
  .delete(deleteWorkspace);

module.exports = router;