const nodemailer = require('nodemailer');
const cron = require('node-cron');
const gmail = require('gmail-api');
const schedule = require('node-schedule');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-password'
  }
});

const mailOptions = {
  from: 'sender-email@gmail.com',
  to: 'receiver-email@gmail.com',
  subject: 'Scheduled Email',
  text: 'This is a scheduled email sent using Node.js and nodemailer.'
};

// Schedule the email to be sent every day at 12:00 PM
cron.schedule('0 12 * * *', () => {
  console.log('Sending scheduled email...');
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.messageId);
    }
  });
});