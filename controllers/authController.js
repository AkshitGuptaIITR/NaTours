const { promisify } = require('util')
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({
    id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
}

//This is the signup function to create user
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    // passwordChangedAt: req.body.passwordChangedAt
    role: req.body.role || 'user'
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  })
  next();
});


//This is the login function to login the user
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Checking the Email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  //  Finding the user with the email provided 
  const user = await User.findOne({ email }).select('+password');
  // console.log(user)
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401))
  }

  //Creating the token
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token: token
  })
});

exports.protect = catchAsync(async (req, res, next) => {

  // * Getting the token
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please login to get access', 401));
  }

  // * Verification of the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // * Check user still exists or not
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user doesnot exists', 401));
  }

  // * Check if user changed password after token was issued 
  if (currentUser.changesPasswordAfter(decoded.iat)) {
    return next(new AppError('User recenty Changed password please log in again', 401))
  }

  // ! Grant access to the protected routes
  req.user = currentUser;
  next();
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403))
    }

    next();
  }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that address', 404));
  }

  // Generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //Sending the email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;
  const message = `Forgot Your Password Submit a Patch request with your new password and passwordConfirm to the ${resetURL}.\n If you didn't forget your password, please ignore.`
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token(valid for 10 min only)',
      message,
    })

    res.status(200).json({
      status: 'success',
      message: 'Token send to email!'
    })
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    return next(new AppError('There was an Error sending the error to the email. Try Again!', 500))
  }
})

// ! Error while sending mail

exports.resetPassword = (req, res, next) => {

}