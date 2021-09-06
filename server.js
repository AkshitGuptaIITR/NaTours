const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

//Connection for database 

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
  console.log('Database connnected!!')
}).catch(err => console.log(err));

//Creating the mongoDB Schema Table for your database

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Forest Hiker',
  rating: 4.7,
  // price: 488
});

testTour.save().then((doc) =>{
  console.log(doc)
}).catch((err) => console.log(err))

//Starting Server

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log('Server Started', PORT)
})//Start the server