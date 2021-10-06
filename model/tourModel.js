const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');
const Review = require('./reviewModel')
// const validator = require('validator');

//Creating the mongoDB Schema Table for your database

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less or equal 40 character'],
    minlength: [10, 'A tour must have greater than 10 or equal to 10 characters'],
    // validate: [validator.isAlpha, 'Enter only alphabets as names']

  },
  duration: {
    type: Number,
    required: [true, 'Must Have A Duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'It should have difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty must be either easy, medium or difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'rating must be greater than 1'],
    max: [5, 'rating must be below 5']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },

  // * using custom validator

  priceDiscount: {
    type: Number,
    validate:
    {
      validator:
        function (val) {
          return val < this.price
          // ! This will check that the price is greater than priceDiscount or not and return true or false which will then trigger validation error 
        },
      message: 'Price discount ({VALUE}) must be less than the price',
    }
  },
  summary: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'Tour must have a cover image'],
  },
  images: {
    type: [String]
  },
  createdAt: {
    type: Date,
    select: false,
    default: Date.now()
  },
  startDates: [Date],
  slug: String,
  secretTour: {
    type: Boolean,
    default: false
  },
  startLocation: {
    //* GeoJSON is the data types for storing goe Station information in mongo
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  locations: [
    {
      type: {
        type: String,
        default: 'Point',
        enum: 'Point'
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
    }
  ],
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: User
    }
  ],
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// * Virtual properties that don't get saved in the database

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
})

//* Virtual populate
// tourSchema.virtual('reviews', {
//   ref: Review,
//   foreignField: 'tour',
//   localField: '_id'
// })

// * Document Middleware

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//? This is the embedding of the users in tours 

tourSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(async id => await User.findById(id))

  //* Promise.all get the input of all the promises of an array at the same time
  this.guides = await Promise.all(guidesPromises);

  next();
})

// * Runs before save command
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// })

// ? Query middleware
// * This is the regular expression that is used to ad any function with the find

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre(/^find/, function (next) {
  //? populate() helps us to fill up the data of the referenced fields like guides in this case
  this.populate({
    path: 'guides',
    // select: '-__v -passwordChangedAt'
  });
  next();
})

// tourSchema.post(/^find/, function(doc, next) {
//   console.log(doc);
//   next();
// })

// ! Aggregation middlewares
// * Used for running the aggregate middleware 

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } }
  })
  next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
