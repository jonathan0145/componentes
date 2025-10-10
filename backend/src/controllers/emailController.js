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
      return res.status(400).json({ error: 'Faltan campos obligatorios: to, subject, text/html' });
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html
    };
    await transporter.sendMail(mailOptions);
    res.json({ mensaje: 'Correo enviado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar el correo', detalle: error.message });
  }
};
