const express = require('express');
const router = express.Router({ mergeParams: true });
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

router
  .route('/')
  .post(authController.protect, authController.restrictTo('user'), reviewController.setToursAndUserIds, reviewController.createReview)
  .get(reviewController.getAllReview);

router.
  route('/:id')
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview)

module.exports = router;