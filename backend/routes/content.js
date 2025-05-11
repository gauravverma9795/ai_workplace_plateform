const express = require('express');
const { 
  createContent,
  getWorkspaceContent,
  getContent,
  updateContent,
  deleteContent,
  generateContent
} = require('../controllers/contentController');
const { requireAuth, loadUser } = require('../middleware/clerkAuth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(requireAuth);
router.use(loadUser);

router.route('/')
  .post(createContent);

router.get('/workspace/:workspaceId', getWorkspaceContent);
router.post('/generate', generateContent);

router.route('/:id')
  .get(getContent)
  .put(updateContent)
  .delete(deleteContent);

module.exports = router;