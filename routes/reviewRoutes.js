const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

router
  .route('/')
  .post(authController.protect, authController.restrictTo('user'), reviewController.createReview)
  .get(reviewController.getAllReview);

module.exports = router;