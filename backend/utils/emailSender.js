// backend/utils/emailSender.js
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1. Create a transporter for Gmail
  // This configuration correctly uses the 'gmail' service with your .env credentials.
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME, // Your full Gmail address from .env
      pass: process.env.EMAIL_PASSWORD, // Your 16-character App Password from .env
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // 3. Send the email using the transporter
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully via Gmail: ' + info.response);
    return true;
  } catch (error) {
    console.error('Nodemailer Error: Could not send email.', error);
    throw new Error('Email could not be sent. Please check server logs and .env configuration.');
  }
};

export default sendEmail;