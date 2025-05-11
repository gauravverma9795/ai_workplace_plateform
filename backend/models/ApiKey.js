const mongoose = require('mongoose');
const crypto = require('crypto');

const ApiKeySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name for this API key'],
    trim: true,
  },
  key: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    enum: ['openai'],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUsed: {
    type: Date,
  },
});

// Method to generate new API key
ApiKeySchema.statics.generateKey = function () {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = mongoose.model('ApiKey', ApiKeySchema);