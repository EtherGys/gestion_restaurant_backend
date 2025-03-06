const cron = require('node-cron');
const user = require('./model/User')
const reservation = require('./model/Reservation')
const sendEmail = require('./mail');
require('dotenv').config();

// lancement des emails de rappel tous les jours à 5h
const task = cron.schedule('0 5 * * *', async () => {

    const reservations = await reservation.find({date: {
        $gte: new Date(new Date().setHours(0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59))
    } }).populate('user');
    
    
    
    for (const resa of reservations) {
        if (resa.user && resa.user.email) {
            // Contenu du rappel
            const subject = "🔔 Rappel de votre réservation";
            const htmlContent = `
            <h1>Bonjour ${resa.user.username},</h1>
            <p>Ceci est un rappel pour votre réservation prévu le <strong>${resa.date}</strong>.</p>
            <p>Merci et à bientôt !</p>
        `;
            
            // Envoi de l'email
            await sendEmail(resa.user.email, subject, htmlContent);
            console.log(`📩 Email envoyé à ${resa.user.email} pour le réservation du ${resa.date}`);
        }
    }
    
    
})
module.exports = task