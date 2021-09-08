const mongoose = require('mongoose');
const slugify = require('slugify');

//Creating the mongoDB Schema Table for your database

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
    trim: true
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
    required: [true, 'It should have difficulty']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  priceDiscount: {
    type: Number
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
  slug: String
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// * Virtual properties that don't get saved in the database

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
})

// * Document Middleware
// * Runs before save command

// tourSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// })

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
