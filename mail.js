const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Fonction pour envoyer un email
const sendEmail = async (to, subject, htmlContent) => {
    try {
        const info = await transporter.sendMail({
            from: `"Mon Application" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html: htmlContent
        });

        console.log("Email envoyé : ", info.messageId);
        return true;
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email : ", error);
        return false;
    }
};

module.exports = sendEmail;