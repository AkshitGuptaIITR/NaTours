const Tour = require("../model/tourModel");

// * ! This is the miidle ware to set 5 cheap and good tours

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingAverage';
  req.query.fields = 'name,price,ratingsAveraage,summary,difficulty';
  next();
}

// * Creating the class for with the methods that help us to re use the code again


// ! Error here in the query parameter
 
class APIfeatures {
  // * Constructor functions run just as soon as the class method is created
  constructor(query, queryString) {
    this.query = query; // * Creating query variable in the class
    this.queryString = queryString // * Creating the queryString variable in the class
  }

  filter() {
    //Here The filtering logic is also applied
    const queryQbj = { ...this.queryString };
    const excludedFields = ['page', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryQbj[el]);

    // let queryStr = JSON.stringify(queryQbj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // console.log(queryStr)
    this.query = this.query.find(JSON.stringify(queryQbj))
    console.log(this.query)
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(" ");
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

// * ! This used of the getting of the tours and pagination, sorting, limiting, searching logic applied

exports.getTours = async (req, res) => {
  try {
    // * Execute Query 
    const features = new APIfeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
    const tours = await features.query;

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
      message: err.message
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