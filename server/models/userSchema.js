const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
