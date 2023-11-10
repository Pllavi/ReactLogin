// emailService.js

const nodemailer = require('nodemailer');

const sendOtpEmail = async (recipientEmail, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'sharmapallavi63481@gmail.com', 
        pass: 'wolqdkxjifyswvtl', 
      },
    });

    
    const mailOptions = {
      from:'sharmapallavi63481@gmail.com',
      to: recipientEmail,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };

  
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
  } catch (error) {
    console.log('Error sending email:', error);
  }
};

module.exports = sendOtpEmail;
