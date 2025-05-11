const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user subscription
// @route   PUT /api/users/subscription
// @access  Private
exports.updateSubscription = asyncHandler(async (req, res, next) => {
  const { subscriptionPlan } = req.body;

  if (!['base', 'pro'].includes(subscriptionPlan)) {
    return next(new ErrorResponse('Invalid subscription plan', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { subscriptionPlan },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  if (!req.user.isSystemAdmin) {
    return next(new ErrorResponse('Not authorized to access this route', 403));
  }

  const users = await User.find();

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Make user a system admin (admin only)
// @route   PUT /api/users/:id/admin
// @access  Private/Admin
exports.makeUserAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user.isSystemAdmin) {
    return next(new ErrorResponse('Not authorized to access this route', 403));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isSystemAdmin: true },
    { new: true }
  );

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});