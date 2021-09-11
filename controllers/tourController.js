const Tour = require("../model/tourModel");
const APIfeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// * ! This is the miidle ware to set 5 cheap and good tours

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingAverage';
  req.query.fields = 'name,price,ratingsAveraage,summary,difficulty';
  next();
}

// * ! This used of the getting of the tours and pagination, sorting, limiting, searching logic applied

exports.getTours = catchAsync(async (req, res, next) => {
  // * Execute Query 

  const features = new APIfeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
  const tours = await features.query;

  res.status(200).json({
    status: 'sucess',
    results: tours.length,
    data: {
      tours
    }
  })
});



exports.createTour = catchAsync(async (req, res, next) => {
  // * This is the another way of doing the save of the object
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  })
  // try {

  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err
  //   })
  // }
  //This is the one way to do

  // const newTour = new Tour({});
  // newTour.save();
});

exports.updateTour = catchAsync(async (req, res, next) => {
  //The Logic is not completed
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!tour) {
    return next(new AppError('No tour found with this id', 404))
  }

  res.status(201).json({
    status: 'success',
    data: {
      tour: updatedTour
    }
  })

})

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with this id', 404))
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
})

exports.searchTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  // Tour.findOne({_id: req.params.id})

  if (!tour) {
    return next(new AppError('No tour found with this id', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  })

});

// * This is the aggregate pipeline which makes match, group and sort as the function
// * This is used to do operations on the data in the database 
// * The group is made be the _id of the group

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        num: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      stats
    }
  })

});

// * This is to display the monthly tour count in particular year

exports.getMontlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  // * Unwind is used to break the array objects

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: - 1 }
      // * in sort 1 means ascending order and -1 for descending
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      plan
    }
  })

})