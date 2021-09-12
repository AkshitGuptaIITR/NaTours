const AppError = require("../utils/appError");

const handleCastErrorDB = err => {
  // console.log(err.message)
  const message = `Invalid ${err.path}: ${err.value}`;
  return (new AppError(message, 400))
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err
  });
}

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // console.error('Error', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    })
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  // console.log(err.message)

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  }
  else if (process.env.NODE_ENV) {
    let error = { ...err, message: err.message, name: err.name };
    console.log(error.name)
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error)
    }
    sendErrorProd(error, res);
  }

  next();
}

