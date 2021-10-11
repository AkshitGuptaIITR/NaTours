const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
  // console.log(Model)
  // console.log(req.params.id)
  //! Not getting deleted check this
  const doc = await Model.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError('No document found with this id', 404))
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
})

exports.updateOne = Model => catchAsync(async (req, res, next) => {
  //The Logic is not completed
  const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!updatedDoc) {
    return next(new AppError('No document found with this id', 404))
  }

  res.status(201).json({
    status: 'success',
    data: {
      data: updatedDoc
    }
  })
})

exports.createOne = Model => catchAsync(async (req, res, next) => {
  // * This is the another way of doing the save of the object
  const doc = await Model.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  })
});
