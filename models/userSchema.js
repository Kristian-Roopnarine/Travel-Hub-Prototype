const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cypto = require('crypto');

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
  },
  email: {
    type: String,
    required: [true, 'Your account needs an email address'],
    unique: true,
  },
  password: {
    type: String,
    select: false,
    required: [true, 'Enter a password for your account'],
  },
  passwordConfirm: {
    type: String,
    select: false,
    required: true,
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordLastChangedAt: {
    type: Date,
    default: Date.now(),
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});
