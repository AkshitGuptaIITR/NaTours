const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController')

//Param middleware

// router.param('id', tourController.checkId)

router
  .route('/tour-stats')
  .get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(tourController.getMontlyPlan);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getTours)

router
  .route('/')
  .get(authController.protect, tourController.getTours)
  .post(tourController.createTour)

router
  .route('/:id')
  .get(tourController.searchTour)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour)
  .patch(tourController.updateTour);

module.exports = router;