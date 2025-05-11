const express = require('express');
const { 
  getCurrentUser, 
  updateSubscription, 
  getUsers, 
  makeUserAdmin 
} = require('../controllers/userController');
const { requireAuth, loadUser } = require('../middleware/clerkAuth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(requireAuth);
router.use(loadUser); // Apply this AFTER requireAuth

router.get('/me', getCurrentUser);
router.put('/subscription', updateSubscription);
router.get('/', getUsers);
router.put('/:id/admin', makeUserAdmin);

module.exports = router;