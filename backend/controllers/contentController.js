const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Content = require('../models/Content');
const { hasWorkspaceRole } = require('../middleware/roleCheck');
const aiService = require('../services/aiService');

// @desc    Create content
// @route   POST /api/content
// @access  Private
exports.createContent = [
  hasWorkspaceRole(['Admin', 'Editor']),
  asyncHandler(async (req, res, next) => {
    req.body.createdBy = req.user._id;
    req.body.lastEditedBy = req.user._id;

    const content = await Content.create(req.body);

    res.status(201).json({
      success: true,
      data: content
    });
  })
];

// @desc    Get all content for a workspace
// @route   GET /api/content/workspace/:workspaceId
// @access  Private
exports.getWorkspaceContent = [
  hasWorkspaceRole(['Admin', 'Editor', 'Viewer']),
  asyncHandler(async (req, res, next) => {
    const content = await Content.find({ workspace: req.params.workspaceId })
      .sort('-createdAt')
      .populate('createdBy', 'name')
      .populate('lastEditedBy', 'name');

    res.status(200).json({
      success: true,
      count: content.length,
      data: content
    });
  })
];

// @desc    Get single content
// @route   GET /api/content/:id
// @access  Private
exports.getContent = asyncHandler(async (req, res, next) => {
  const content = await Content.findById(req.params.id)
    .populate('createdBy', 'name')
    .populate('lastEditedBy', 'name');

  if (!content) {
    return next(new ErrorResponse(`Content not found with id of ${req.params.id}`, 404));
  }

  // Check if user has access to the workspace this content belongs to
  const isCreator = content.createdBy._id.toString() === req.user._id.toString();
  
  if (!isCreator) {
    // This will check if user has appropriate role in the workspace
    await hasWorkspaceRole(['Admin', 'Editor', 'Viewer'])(
      { params: { workspaceId: content.workspace } },
      res,
      () => {}
    );
  }

  res.status(200).json({
    success: true,
    data: content
  });
});

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private
exports.updateContent = asyncHandler(async (req, res, next) => {
  let content = await Content.findById(req.params.id);

  if (!content) {
    return next(new ErrorResponse(`Content not found with id of ${req.params.id}`, 404));
  }

  // Check if user has appropriate role in the workspace
  await hasWorkspaceRole(['Admin', 'Editor'])(
    { params: { workspaceId: content.workspace } },
    res,
    () => {}
  );

  // Update last edited by
  req.body.lastEditedBy = req.user._id;
  req.body.updatedAt = Date.now();

  content = await Content.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: content
  });
});

// @desc    Delete content
// @route   DELETE /api/content/:id
// @access  Private
exports.deleteContent = asyncHandler(async (req, res, next) => {
  const content = await Content.findById(req.params.id);

  if (!content) {
    return next(new ErrorResponse(`Content not found with id of ${req.params.id}`, 404));
  }

  // Check if user has appropriate role in the workspace
  await hasWorkspaceRole(['Admin', 'Editor'])(
    { params: { workspaceId: content.workspace } },
    res,
    () => {}
  );

  await content.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Generate AI content
// @route   POST /api/content/generate
// @access  Private
exports.generateContent = [
  hasWorkspaceRole(['Admin', 'Editor']),
  asyncHandler(async (req, res, next) => {
    const { prompt, workspaceId, maxTokens = 500 } = req.body;

    if (!prompt) {
      return next(new ErrorResponse('Please provide a prompt', 400));
    }

    const generatedContent = await aiService.generateContent(prompt, maxTokens, req.user._id);

    res.status(200).json({
      success: true,
      data: {
        content: generatedContent,
        prompt
      }
    });
  })
];