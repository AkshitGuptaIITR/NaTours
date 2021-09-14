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
    minlength: [8, 'password Length must be 8 characters']
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
})

const User = mongoose.model('User', userSchema);

module.exports = User;

