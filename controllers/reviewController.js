const Review = require("../model/reviewModel")
const catchAsync = require("../utils/catchAsync")
const factory = require('./handlerFactory');

exports.setToursAndUserIds = (req, res, next) => {
  //* Allow the nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
}

exports.createReview = factory.createOne(Review);
exports.getAllReview = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.params.tourId) {
    filter = { tour: req.params.tourId }
  }

  const reviews = await Review.find(filter);
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews
    }
  })
});

exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);