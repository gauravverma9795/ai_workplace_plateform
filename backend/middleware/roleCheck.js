const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const TeamMember = require('../models/TeamMember');
const Workspace = require('../models/Workspace');

// Check if user has the required role in the workspace
exports.hasWorkspaceRole = (requiredRoles) => {
  return asyncHandler(async (req, res, next) => {
    const workspaceId = req.params.workspaceId || req.body.workspace;

    if (!workspaceId) {
      return next(new ErrorResponse('Workspace ID is required', 400));
    }

    // Check if user is the workspace owner
    const workspace = await Workspace.findById(workspaceId);
    
    if (!workspace) {
      return next(new ErrorResponse('Workspace not found', 404));
    }
    
    // If user is the workspace owner, they have full access
    if (workspace.owner.toString() === req.user._id.toString()) {
      return next();
    }

    // Check if user is a member of the workspace with the required role
    const membership = await TeamMember.findOne({
      workspace: workspaceId,
      user: req.user._id,
      inviteAccepted: true
    });

    if (!membership || !requiredRoles.includes(membership.role)) {
      return next(
        new ErrorResponse('Not authorized to perform this action in this workspace', 403)
      );
    }

    next();
  });
};

// Check subscription limits
exports.checkSubscriptionLimits = asyncHandler(async (req, res, next) => {
  const { subscriptionPlan } = req.user;
  
  // Check workspace limit
  if (req.method === 'POST' && req.originalUrl.includes('/api/workspaces')) {
    const workspaceCount = await Workspace.countDocuments({ owner: req.user._id });
    
    const maxWorkspaces = subscriptionPlan === 'pro' ? 10 : 3;
    
    if (workspaceCount >= maxWorkspaces) {
      return next(
        new ErrorResponse(`Your ${subscriptionPlan} plan allows a maximum of ${maxWorkspaces} workspaces`, 403)
      );
    }
  }
  
  // Check team size limit when adding new members
  if ((req.method === 'POST' && req.originalUrl.includes('/api/teams')) || 
      (req.method === 'PUT' && req.originalUrl.includes('/api/teams/invite'))) {
    
    const workspaceId = req.params.workspaceId || req.body.workspace;
    
    if (workspaceId) {
      const memberCount = await TeamMember.countDocuments({ workspace: workspaceId });
      
      const maxMembers = subscriptionPlan === 'pro' ? 5 : 2;
      
      if (memberCount >= maxMembers) {
        return next(
          new ErrorResponse(`Your ${subscriptionPlan} plan allows a maximum of ${maxMembers} members per workspace`, 403)
        );
      }
    }
  }
  
  next();
});

// Check if user has the required role in the workspace
exports.hasWorkspaceRole = (requiredRoles) => {
  return asyncHandler(async (req, res, next) => {
    let workspaceId = req.params.workspaceId || req.body.workspace;
    
    // If we're updating a team member, we may need to fetch the workspace ID from the team member
    if (!workspaceId && req.params.id && req.originalUrl.includes('/api/teams/')) {
      const teamMember = await TeamMember.findById(req.params.id);
      if (teamMember && teamMember.workspace) {
        workspaceId = teamMember.workspace;
        // Add it to the request for other middleware/controllers
        req.body.workspace = workspaceId;
      }
    }

    if (!workspaceId) {
      return next(new ErrorResponse('Workspace ID is required', 400));
    }

    // Check if user is the workspace owner
    const workspace = await Workspace.findById(workspaceId);
    
    if (!workspace) {
      return next(new ErrorResponse('Workspace not found', 404));
    }
    
    // If user is the workspace owner, they have full access
    if (workspace.owner.toString() === req.user._id.toString()) {
      return next();
    }

    // Check if user is a member of the workspace with the required role
    const membership = await TeamMember.findOne({
      workspace: workspaceId,
      user: req.user._id,
      inviteAccepted: true
    });

    if (!membership || !requiredRoles.includes(membership.role)) {
      return next(
        new ErrorResponse('Not authorized to perform this action in this workspace', 403)
      );
    }

    next();
  });
};