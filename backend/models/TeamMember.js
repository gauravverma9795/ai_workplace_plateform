const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  role: {
    type: String,
    enum: ['Admin', 'Editor', 'Viewer'],
    default: 'Viewer',
  },
  inviteAccepted: {
    type: Boolean,
    default: false,
  },
  inviteEmail: {
    type: String,
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a compound index to ensure a user can only be added to a workspace once
TeamMemberSchema.index({ workspace: 1, user: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('TeamMember', TeamMemberSchema);