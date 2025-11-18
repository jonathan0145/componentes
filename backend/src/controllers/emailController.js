const nodemailer = require('nodemailer');

// Configuración del transporter (puedes usar Gmail, SMTP, etc.)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Enviar correo
exports.sendEmail = async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'Faltan campos obligatorios: to, subject, text/html'
        },
        timestamp: new Date().toISOString()
      });
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html
    };
    await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      data: null,
      message: 'Correo enviado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'EMAIL_001',
        message: 'Error al enviar el correo',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};
