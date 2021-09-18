const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Enter Name']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Enter Your E-mail id'],
    lowercase: true,
    validate: [validator.isEmail, 'Please Enter A valid E-mail']
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    required: [true, 'Enter Your Password'],
    minlength: [8, 'password Length must be 8 characters'],
    select: false // not displaying the password to the user or in the response
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please Confirm Your Password'],
    validate: {
      // ? Works on create or save only
      validator: function (det) {
        return det === this.password; // * Check the password and the confirm password
      },
      message: 'Passwords does not match'
    }
  },
  passwordChangedAt: {
    type: Date
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.pre('save', async function (next) {

  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changesPasswordAfter = function (JWTTimestamp) {

  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimeStamp;
  }

  // false means not changed
  return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;

