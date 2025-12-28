// backend/utils/emailSender.js
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Validate required environment variables
  if (!process.env.EMAIL_USERNAME) {
    console.error('EMAIL_USERNAME is not set in environment variables');
    throw new Error('Email configuration error: EMAIL_USERNAME is missing');
  }

  if (!process.env.EMAIL_PASSWORD) {
    console.error('EMAIL_PASSWORD is not set in environment variables');
    throw new Error('Email configuration error: EMAIL_PASSWORD is missing');
  }

  if (!process.env.EMAIL_FROM_ADDRESS) {
    console.error('EMAIL_FROM_ADDRESS is not set in environment variables');
    throw new Error('Email configuration error: EMAIL_FROM_ADDRESS is missing');
  }

  // 1. Create a transporter for Gmail
  // Support both 'gmail' service and custom host/port configuration
  let transporterConfig;

  if (process.env.EMAIL_HOST && process.env.EMAIL_PORT) {
    // Use custom host/port if provided
    transporterConfig = {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    };
    console.log(`Using custom SMTP: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`);
  } else {
    // Use Gmail service (default)
    transporterConfig = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    };
    console.log('Using Gmail service');
  }

  const transporter = nodemailer.createTransport(transporterConfig);

  // Verify transporter configuration before sending
  try {
    await transporter.verify();
    console.log('Email transporter verified successfully');
  } catch (verifyError) {
    console.error('Email transporter verification failed:', verifyError.message);
    throw new Error(`Email configuration error: ${verifyError.message}`);
  }

  // 2. Define the email options
  const fromName = process.env.EMAIL_FROM_NAME || 'Portfolio';
  const mailOptions = {
    from: `"${fromName}" <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // 3. Send the email using the transporter
  try {
    console.log(`Attempting to send email to: ${options.email}`);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    console.log('Email response:', info.response);
    return true;
  } catch (error) {
    console.error('Nodemailer Error Details:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('Error Response:', error.response);
    console.error('Full Error:', error);
    
    // Provide more specific error messages
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check EMAIL_USERNAME and EMAIL_PASSWORD. For Gmail, use an App Password, not your regular password.');
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Email connection failed. Please check EMAIL_HOST and EMAIL_PORT.');
    } else {
      throw new Error(`Email could not be sent: ${error.message}`);
    }
  }
};

export default sendEmail;