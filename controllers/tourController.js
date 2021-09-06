const Tour = require("../model/tourModel");

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'sucess',
      results: tours.length,
      data: {
        tours
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
};

exports.createTour = async (req, res) => {
  //This is the another way of doing the save of the object

  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data send'
    })
  }
  //This is the one way to do

  // const newTour = new Tour({});
  // newTour.save();
};

exports.updateTour = (req, res) => {
  //The Logic is not completed
  res.status(200).json({
    status: 'sucess',
    data: {
      tour: 'Updated Tours Here'
    }
  })
}

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'Success',
    data: null
  })
}

exports.searchTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id: req.params.id})
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
};