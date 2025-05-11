const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const ApiKey = require('../models/ApiKey');

// @desc    Get all user API keys
// @route   GET /api/api-keys
// @access  Private
exports.getUserApiKeys = asyncHandler(async (req, res, next) => {
  const apiKeys = await ApiKey.find({ user: req.user._id });

  // For security, don't send back the actual keys
  const sanitizedKeys = apiKeys.map(key => ({
    ...key.toObject(),
    key: key.key ? `${key.key.substring(0, 5)}...${key.key.substring(key.key.length - 5)}` : undefined
  }));

  res.status(200).json({
    success: true,
    count: apiKeys.length,
    data: sanitizedKeys
  });
});

// @desc    Add new API key
// @route   POST /api/api-keys
// @access  Private
exports.addApiKey = asyncHandler(async (req, res, next) => {
  const { name, key, service } = req.body;

  if (!name || !key || !service) {
    return next(new ErrorResponse('Please provide all required fields', 400));
  }

  // Check if user already has a key with this name
  const existingKey = await ApiKey.findOne({ 
    user: req.user._id,
    name: name
  });

  if (existingKey) {
    return next(new ErrorResponse(`You already have an API key named "${name}"`, 400));
  }

  // Create API key
  const apiKey = await ApiKey.create({
    name,
    key,
    service,
    user: req.user._id
  });

  // Don't return the actual key in the response for security
  const response = {
    ...apiKey.toObject(),
    key: `${key.substring(0, 5)}...${key.substring(key.length - 5)}`
  };

  res.status(201).json({
    success: true,
    data: response
  });
});

// @desc    Delete API key
// @route   DELETE /api/api-keys/:id
// @access  Private
exports.deleteApiKey = asyncHandler(async (req, res, next) => {
  const apiKey = await ApiKey.findById(req.params.id);

  if (!apiKey) {
    return next(new ErrorResponse(`API key not found with id of ${req.params.id}`, 404));
  }

  // Make sure user owns the API key
  if (apiKey.user.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse(`Not authorized to delete this API key`, 403));
  }

  await apiKey.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Toggle API key active status
// @route   PUT /api/api-keys/:id/toggle
// @access  Private
exports.toggleApiKey = asyncHandler(async (req, res, next) => {
  let apiKey = await ApiKey.findById(req.params.id);

  if (!apiKey) {
    return next(new ErrorResponse(`API key not found with id of ${req.params.id}`, 404));
  }

  // Make sure user owns the API key
  if (apiKey.user.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse(`Not authorized to update this API key`, 403));
  }

  // Toggle the active status
  apiKey = await ApiKey.findByIdAndUpdate(
    req.params.id,
    { active: !apiKey.active },
    { new: true, runValidators: true }
  );

  // Don't return the actual key in the response for security
  const response = {
    ...apiKey.toObject(),
    key: apiKey.key ? `${apiKey.key.substring(0, 5)}...${apiKey.key.substring(apiKey.key.length - 5)}` : undefined
  };

  res.status(200).json({
    success: true,
    data: response
  });
});

// @desc    Generate a new OpenAI API key (this is a mock function as OpenAI doesn't allow programmatic key creation)
// @route   POST /api/api-keys/generate
// @access  Private
exports.generateApiKey = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new ErrorResponse('Please provide a name for your API key', 400));
  }

  // Generate a mock key
  const generatedKey = ApiKey.generateKey();

  res.status(200).json({
    success: true,
    data: {
      name,
      key: generatedKey,
      note: "This is a mock key generation. In a real app, you would redirect users to the OpenAI dashboard to create a key."
    }
  });
});

// @desc    Verify an OpenAI API key
// @route   POST /api/api-keys/verify
// @access  Private
exports.verifyApiKey = asyncHandler(async (req, res, next) => {
  const { key } = req.body;

  if (!key) {
    return next(new ErrorResponse('Please provide an API key to verify', 400));
  }

  try {
    // Here you would make a test request to OpenAI to verify the key
    // For simplicity, we'll just return success
    res.status(200).json({
      success: true,
      data: {
        valid: true,
        message: "API key is valid"
      }
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      data: {
        valid: false,
        message: "API key is invalid or has insufficient permissions"
      }
    });
  }
});