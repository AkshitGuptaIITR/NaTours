process.on('uncaughtException', err => {
  console.log(err.name, err.message, err);
  console.log('unCaught Exception');
  process.exit(1)
});

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
})

//Starting Server

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log('Server Started', PORT)
})//Start the server

// ! handling the connection errors

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('unHandled Rejection');
  server.close(() => {
    process.exit(1)
  })
});
