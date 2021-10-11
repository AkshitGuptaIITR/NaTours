const User = require('../model/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObject = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObject[el] = obj[el]
  })
  return newObject;
}

exports.getAllUser = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'sucess',
    results: users.length,
    data: {
      users
    }
  })
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // Creating error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('The router is not for password updates. Please use updatepassword', 400));
  }

  //Filter the name that is not to be updated
  const filterBody = filterObj(req.body, 'name', 'email');

  // Update the user document 
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, { new: true, runValidators: true });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  })
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  })
})

exports.getUser = (req, res) => {
  res.status(200).json({
    status: 'sucess',
    data: {
      message: 'Not set Up right now'
    }
  })
};

exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.createUser = factory.createOne(User)