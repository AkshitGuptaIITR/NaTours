const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

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
  .get(tourController.getTours)
  .post(tourController.createTour)

router
  .route('/:id')
  .get(tourController.searchTour)
  .delete(tourController.deleteTour)
  .patch(tourController.updateTour);

module.exports = router;