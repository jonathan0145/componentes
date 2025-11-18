const { User } = require('../models');
const nodemailer = require('nodemailer');

// Configuración básica de nodemailer (ajusta según tu proveedor)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendVerificationEmail(email, code) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Código de verificación',
    text: `Tu código de verificación es: ${code}`
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };
