const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');

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

exports.getUser = (req, res) => {
  res.status(200).json({
    status: 'sucess',
    data: {
      message: 'Not set Up right now'
    }
  })
};

exports.updateUser = (req, res) => {
  res.status(200).json({
    status: 'sucess',
    data: {
      message: 'Not set Up right now'
    }
  })
};

exports.deleteUser = (req, res) => {
  res.status(200).json({
    status: 'sucess',
    data: {
      message: 'Not set Up right now'
    }
  })
};

exports.createUser = (req, res) => {
  res.status(200).json({
    status: 'sucess',
    data: {
      message: 'Not set Up right now'
    }
  })
};