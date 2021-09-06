const Tour = require("../model/tourModel");

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getTours = async (req, res) => {
  try {
    //Here The filtering logic is also applied

    const queryQbj = { ...req.query };
    const excludedFields = ['page', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryQbj[el]);

    //This is done to avaoid the following to be counted as the filtering parameters

    // console.log(queryQbj);
    // console.log(req.query);

    //Here is the advanced filtering logic for greater than or equalto stuff
    //The queryStr is converted to bject than in the object gte or gt or lte or lt 
    // files are converted in the format of $gte or  $gt or $lte or $lt
    //which can be read by the mongoDB as an parameter for filtering

    let queryStr = JSON.stringify(queryQbj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    // console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));

    //Sorting logic ascending order

    if (req.query.sort) {
      //Put minus sign for decending order
      const sortBy = req.query.sort.split(',').join(" ");
      console.log(sortBy)
      // For adding secong condition use comma in it
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt');
    }

    const tours = await query;

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

exports.updateTour = async (req, res) => {
  //The Logic is not completed
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(201).json({
      status: 'success',
      data: {
        tour: updatedTour
      }
    })
  } catch (err) {

  }
}

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
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