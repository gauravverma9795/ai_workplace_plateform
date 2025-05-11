const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Workspace = require('../models/Workspace');
const TeamMember = require('../models/TeamMember');
const { checkSubscriptionLimits } = require('../middleware/roleCheck');

// @desc    Create new workspace
// @route   POST /api/workspaces
// @access  Private
exports.createWorkspace = [
  checkSubscriptionLimits,
  asyncHandler(async (req, res, next) => {
    req.body.owner = req.user._id;

    const workspace = await Workspace.create(req.body);

    // Add owner as Admin team member
    await TeamMember.create({
      workspace: workspace._id,
      user: req.user._id,
      role: 'Admin',
      inviteAccepted: true
    });

    res.status(201).json({
      success: true,
      data: workspace
    });
  })
];

// @desc    Get all workspaces for user
// @route   GET /api/workspaces
// @access  Private
exports.getWorkspaces = asyncHandler(async (req, res, next) => {
  // Find workspaces where user is owner
  const ownedWorkspaces = await Workspace.find({ owner: req.user._id });
  
  // Find team memberships
  const teamMemberships = await TeamMember.find({ 
    user: req.user._id,
    inviteAccepted: true
  }).populate('workspace');
  
  // Extract workspaces from team memberships
  const teamWorkspaces = teamMemberships.map(tm => {
    if (tm.workspace) {
      return {
        ...tm.workspace.toObject(),
        role: tm.role
      };
    }
    return null;
  }).filter(w => w !== null);
  
  // Combine owned and team workspaces
  const workspaces = [
    ...ownedWorkspaces.map(w => ({
      ...w.toObject(),
      role: 'Owner'
    })),
    ...teamWorkspaces
  ];

  res.status(200).json({
    success: true,
    count: workspaces.length,
    data: workspaces
  });
});

// @desc    Get single workspace
// @route   GET /api/workspaces/:id
// @access  Private
exports.getWorkspace = asyncHandler(async (req, res, next) => {
  const workspace = await Workspace.findById(req.params.id);

  if (!workspace) {
    return next(new ErrorResponse(`Workspace not found with id of ${req.params.id}`, 404));
  }

  // Check if user is owner or team member
  const isOwner = workspace.owner.toString() === req.user._id.toString();
  
  if (!isOwner) {
    const membership = await TeamMember.findOne({
      workspace: workspace._id,
      user: req.user._id,
      inviteAccepted: true
    });
    
    if (!membership) {
      return next(new ErrorResponse(`Not authorized to access this workspace`, 403));
    }
  }

  res.status(200).json({
    success: true,
    data: workspace
  });
});

// @desc    Update workspace
// @route   PUT /api/workspaces/:id
// @access  Private
exports.updateWorkspace = asyncHandler(async (req, res, next) => {
  let workspace = await Workspace.findById(req.params.id);

  if (!workspace) {
    return next(new ErrorResponse(`Workspace not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is workspace owner or admin
  const isOwner = workspace.owner.toString() === req.user._id.toString();
  
  if (!isOwner) {
    const membership = await TeamMember.findOne({
      workspace: workspace._id,
      user: req.user._id,
      role: 'Admin',
      inviteAccepted: true
    });
    
    if (!membership) {
      return next(new ErrorResponse(`Not authorized to update this workspace`, 403));
    }
  }

  workspace = await Workspace.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: workspace
  });
});

// @desc    Delete workspace
// @route   DELETE /api/workspaces/:id
// @access  Private
// @desc    Delete workspace
// @route   DELETE /api/workspaces/:id
// @access  Private
exports.deleteWorkspace = asyncHandler(async (req, res, next) => {
  const workspace = await Workspace.findById(req.params.id);

  if (!workspace) {
    return next(new ErrorResponse(`Workspace not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is workspace owner
  if (workspace.owner.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse(`Not authorized to delete this workspace`, 403));
  }

  // Replace workspace.remove() with Workspace.deleteOne()
  await Workspace.deleteOne({ _id: req.params.id });

  // Also remove all team members associated with this workspace
  await TeamMember.deleteMany({ workspace: req.params.id });

  res.status(200).json({
    success: true,
    data: {}
  });
});