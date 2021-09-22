const nodemailer = require('nodemailer');
const catchAsync = require("./catchAsync");

const sendEmail = catchAsync(async options => {
  // Creating a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD
    }
  })

  // Defining the email options 
  const mailOptions = {
    from : 'Akshit Gupta <Gakshit9292@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: 
  }

  // Sendin the mail 
  transporter.sendMail(mailOptions);
});

module.exports = sendEmail;