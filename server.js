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

//Starting Server

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log('Server Started', PORT)
})//Start the server