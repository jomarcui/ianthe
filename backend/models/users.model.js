const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usersSchema = new Schema({
  dateCreated: {
    required: true,
    trim: true,
    type: Date,
  },
  email: {
    required: true,
    trim: true,
    type: String,
  },
  lastLogin: {
    required: true,
    trim: true,
    type: Date,
  },
  password: {
    required: true,
    trim: true,
    type: String,
  },
  username: {
    required: true,
    trim: true,
    type: String,
  },
}, {
  timestamps: true
});

const users = mongoose.model('users', usersSchema);

module.exports = users;
