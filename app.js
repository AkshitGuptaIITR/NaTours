const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
// const fs = require('fs')
dotenv.config({ path: './config.env' });

const app = express();
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));


// app.use((req, res, next) => {
//   console.log("Middleware");
//   next();
// });

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'From the server', app: 'Notorious' });
// })

// app.post('/', (req, res) => {
//   res.status(200).send('Post Method')
// })

//This is used to get the id and filter some data and get the information as parameters
// parameters can be set optional with question marks

// app.get('/api/v1/tours/:id', searchTour);
// app.get('/api/v1/tours', getTours);
//Post Request
// app.post('/api/v1/tours', createTour)
//Patch 
// app.patch('/api/v1/tours/:id', updateTour);
//Delete
// app.delete('/api/v1/tours/:id', deleteTour)


//Adding route for ease

//Creating different router
//These are middlewares
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// * This is the error handler that helps to send a response on unhandled routes

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`
  // });
  // next()
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail'
  err.statusCode = 404;
  
  // ! The argument in next function is always treated as error.
  next(err)
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });

  next();
})

module.exports = app;

//This contains the only code related to express