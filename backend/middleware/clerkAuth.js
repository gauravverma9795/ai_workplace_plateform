const { 
  ClerkExpressRequireAuth,
  ClerkExpressWithAuth 
} = require('@clerk/clerk-sdk-node');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// Clerk authentication middleware
exports.requireAuth = ClerkExpressRequireAuth({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
  onError: (err, req, res) => {
    res.status(401).json({
      success: false,
      error: 'Not authorized to access this route',
    });
  },
});

// Express middleware with authentication
exports.withAuth = ClerkExpressWithAuth({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Load user from database or create if doesn't exist
exports.loadUser = asyncHandler(async (req, res, next) => {
  // Debug what we're getting from Clerk
  console.log("Auth session data:", {
    userId: req.auth?.userId,
    sessionId: req.auth?.sessionId,
    hasSessionClaims: !!req.auth?.sessionClaims,
  });

  if (!req.auth || !req.auth.userId) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  
  try {
    // Find or create user in our database
    let user = await User.findOne({ clerkId: req.auth.userId });
    
    // Extract user information from clerk session data
    const userData = {
      clerkId: req.auth.userId,
      name: 'Anonymous User', // Default fallback name
      email: 'user@example.com', // Default fallback email
    };
    
    // Try to get better data if available
    if (req.auth.sessionClaims) {
      if (req.auth.sessionClaims.email) {
        userData.email = req.auth.sessionClaims.email;
      }
      
      // Try to get user's name from various possible claim formats
      if (req.auth.sessionClaims.name) {
        userData.name = req.auth.sessionClaims.name;
      } else if (req.auth.sessionClaims.family_name && req.auth.sessionClaims.given_name) {
        userData.name = `${req.auth.sessionClaims.given_name} ${req.auth.sessionClaims.family_name}`;
      } else if (req.auth.sessionClaims.firstName && req.auth.sessionClaims.lastName) {
        userData.name = `${req.auth.sessionClaims.firstName} ${req.auth.sessionClaims.lastName}`;
      }
      
      if (req.auth.sessionClaims.email_verified) {
        userData.emailVerified = req.auth.sessionClaims.email_verified;
      }
    }
    
    // Log the constructed user data for debugging
    console.log("User data being used:", userData);
    
    if (!user) {
      // Create a new user record in our DB
      user = await User.create(userData);
      console.log("Created new user:", user._id);
    } else {
      console.log("Found existing user:", user._id);
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error("User creation/lookup error:", error);
    return next(new ErrorResponse('Error creating or finding user', 500));
  }
});