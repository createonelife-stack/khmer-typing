const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'owner'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active'
  },
  loginCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: String,
    default: null
  },
  fullName: {
    type: String,
    default: ""
  },
  gender: {
    type: String,
    default: ""
  },
  jobRole: {
    type: String,
    default: ""
  },
  photo: {
    type: String,
    default: ""
  },
  profileCompleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
