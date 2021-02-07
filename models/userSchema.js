const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cypto = require('crypto');
const { nextTick } = require('process');

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

userSchema.pre('save', function (next) {
  if (!this.isMofidied('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isMofidied('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
