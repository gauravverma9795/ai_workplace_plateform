const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const TeamMember = require('../models/TeamMember');
const Workspace = require('../models/Workspace');

// Dedicated controller just for removing team members
const removeTeamMember = asyncHandler(async (req, res, next) => {
  const teamMemberId = req.params.id;
  
  // Basic validation
  if (!teamMemberId || !teamMemberId.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new ErrorResponse(`Invalid team member ID format`, 400));
  }
  
  console.log(`Attempting to delete team member with ID: ${teamMemberId}`);
  
  try {
    // Find the team member first
    const teamMember = await TeamMember.findById(teamMemberId);
    
    if (!teamMember) {
      console.log(`Team member with ID ${teamMemberId} not found`);
      return next(new ErrorResponse(`Team member not found`, 404));
    }
    
    console.log(`Found team member: ${teamMember._id}`);
    
    // If there's no workspace associated, delete directly
    if (!teamMember.workspace) {
      console.log('No workspace associated, deleting directly');
      await TeamMember.deleteOne({ _id: teamMemberId });
      return res.status(200).json({ success: true, data: {} });
    }
    
    const workspaceId = teamMember.workspace;
    console.log(`Team member's workspace: ${workspaceId}`);
    
    // Find the associated workspace
    const workspace = await Workspace.findById(workspaceId);
    
    // If workspace doesn't exist, delete the team member anyway
    if (!workspace) {
      console.log('Workspace not found, but proceeding with deletion');
      await TeamMember.deleteOne({ _id: teamMemberId });
      return res.status(200).json({ success: true, data: {} });
    }
    
    // Check if current user is workspace owner
    const isOwner = workspace.owner && 
      workspace.owner.toString() === req.user._id.toString();
    
    console.log(`Current user is owner: ${isOwner}`);
    
    // If not owner, check if admin
    if (!isOwner) {
      const adminMembership = await TeamMember.findOne({
        workspace: workspaceId,
        user: req.user._id,
        role: 'Admin',
        inviteAccepted: true
      });
      
      if (!adminMembership) {
        console.log('User is not owner or admin - access denied');
        return next(new ErrorResponse('Not authorized to remove team members', 403));
      }
      
      console.log('User is admin - access granted');
    }
    
    // Finally delete the team member
    console.log(`Deleting team member: ${teamMemberId}`);
    const result = await TeamMember.deleteOne({ _id: teamMemberId });
    
    console.log(`Deletion result: ${JSON.stringify(result)}`);
    
    return res.status(200).json({
      success: true,
      data: {}
    });
    
  } catch (error) {
    console.error('Error in team member removal:', error);
    return next(new ErrorResponse(`Error removing team member: ${error.message}`, 500));
  }
});

module.exports = removeTeamMember;