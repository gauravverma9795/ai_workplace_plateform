const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Workspace = require('../models/Workspace');
const TeamMember = require('../models/TeamMember');

// Check workspace limits based on subscription plan
exports.checkWorkspaceLimit = asyncHandler(async (req, res, next) => {
  const { subscriptionPlan } = req.user;
  
  // Count user's workspaces
  const workspaceCount = await Workspace.countDocuments({ owner: req.user._id });
  
  // Set limits based on subscription plan
  const maxWorkspaces = subscriptionPlan === 'pro' ? 10 : 3;
  
  if (workspaceCount >= maxWorkspaces) {
    return next(
      new ErrorResponse(`Your ${subscriptionPlan} plan allows a maximum of ${maxWorkspaces} workspaces`, 403)
    );
  }
  
  next();
});

// Check team member limits based on subscription plan
exports.checkTeamMemberLimit = asyncHandler(async (req, res, next) => {
  const { subscriptionPlan } = req.user;
  const workspaceId = req.params.workspaceId || req.body.workspace;
  
  if (!workspaceId) {
    return next(new ErrorResponse('Workspace ID is required', 400));
  }
  
  // Count members in the workspace
  const memberCount = await TeamMember.countDocuments({ 
    workspace: workspaceId,
    inviteAccepted: true 
  });
  
  // Set limits based on subscription plan
  const maxMembers = subscriptionPlan === 'pro' ? 5 : 2;
  
  if (memberCount >= maxMembers) {
    return next(
      new ErrorResponse(`Your ${subscriptionPlan} plan allows a maximum of ${maxMembers} members per workspace`, 403)
    );
  }
  
  next();
});

// Check if user can generate AI content based on subscription
exports.checkAiContentLimit = asyncHandler(async (req, res, next) => {
  // Here you could implement a rate limit or count daily generations
  // For simplicity, we'll just check if the user has an active subscription
  
  const { subscriptionPlan } = req.user;
  
  // For base plan, you could limit the number of tokens or requests per day
  if (subscriptionPlan === 'base') {
    // For this example, we'll allow base plan users to use the API but with limitations
    req.body.maxTokens = Math.min(req.body.maxTokens || 500, 500); // Limit to 500 tokens for base plan
  }
  
  next();
});

// Complete subscription check middleware that combines all checks
exports.checkSubscription = asyncHandler(async (req, res, next) => {
  const path = req.originalUrl;
  const method = req.method;
  
  if (method === 'POST' && path.includes('/api/workspaces')) {
    await exports.checkWorkspaceLimit(req, res, next);
  } 
  else if ((method === 'POST' && path.includes('/api/teams')) || 
           (method === 'PUT' && path.includes('/api/teams/invite'))) {
    await exports.checkTeamMemberLimit(req, res, next);
  }
  else if (method === 'POST' && path.includes('/api/content/generate')) {
    await exports.checkAiContentLimit(req, res, next);
  }
  else {
    next();
  }
});