const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

//Param middleware

// router.param('id', tourController.checkId)

router.route('/').get(tourController.getTours).post(tourController.createTour)
router.route('/:id').get(tourController.searchTour).delete(tourController.deleteTour).patch(tourController.updateTour);

module.exports = router;