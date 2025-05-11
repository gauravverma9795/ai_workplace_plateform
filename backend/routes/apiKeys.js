const express = require('express');
const { 
  getUserApiKeys,
  addApiKey,
  deleteApiKey,
  toggleApiKey,
  generateApiKey,
  verifyApiKey
} = require('../controllers/apiKeyController');
const { requireAuth, loadUser } = require('../middleware/clerkAuth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(requireAuth);
router.use(loadUser);

router.route('/')
  .get(getUserApiKeys)
  .post(addApiKey);

router.delete('/:id', deleteApiKey);
router.put('/:id/toggle', toggleApiKey);
router.post('/generate', generateApiKey);
router.post('/verify', verifyApiKey);

module.exports = router;