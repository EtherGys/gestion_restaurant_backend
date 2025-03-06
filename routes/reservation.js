const express = require('express');
const Reservation = require('../model/Reservation');
const Param = require('../model/Param');
const router = express.Router();
const auth = require('../middleware/authentification');
const sendEmail = require('../mail');
const dateTime = require('date-and-time');


router.post("/create", auth, async (req, res) => {
    const {date, dinersNumber} = req.body;
    
    try {
        const reservations = await Reservation.find({dateDebut: new Date(date) })
        // récupération du paramètre de nombre de tables
        const maxDiners = await Param.findOne({paramName: "dinerNumbers"})
        
        // S'il reste des tables disponibles pour le créneau demandé
        if (reservations.length < parseInt(maxDiners.value)) {
            // récupération du paramètre de durée de réservation
            const hours = await Param.findOne({paramName: "reservationTime"})
            
            const debutDate  =  new Date(date); 
            const endingDate = dateTime.addHours(debutDate,parseInt(hours.value)); 
            
            const newReservation = new Reservation({
                user: req.user.id,
                dateDebut: date,
                dateFin: endingDate,
                dinersNumber: dinersNumber.toString()
            });
            await newReservation.save();
            
            // Contenu du rappel
            const subject = "🔔 Confirmation de réservation";
            const htmlContent = `
            <h1>Bonjour ${req.user.username},</h1>
            <p>Votre réservation du <strong>${date}</strong> pour ${dinersNumber}  couvert${dinersNumber == '1' ? '' : 's'} est confirmée !</p>
            <p>Merci et à bientôt !</p>
            `;
            
            // Envoi de l'email
            await sendEmail(req.user.email, subject, htmlContent);
            console.log(`📩 Email envoyé !`);
            
            res.status(201).send("Reservation created successfully");
        } else {
            res.status(406).send("Reservation not possible : too many booking at this time");
        }
    } catch (error) {
        console.log(error);
        
        res.status(400).json({error});
    }
}
);

router.get("/user", auth, async (req, res) => {
    try {
        
        const reservations = await Reservation.find({user: req.user.id});
        res.status(200).json(reservations);
    } catch (error) {
        res.status(200).json(error);
    }
}
);

router.patch("/:id", auth, async (req, res) => {
    const {date, dinersNumber} = req.body;
    
    const reservationId = req.params.id;
    try {
        const debutDate  =  new Date(date); 
        const endingDate = dateTime.addHours(debutDate,2); 
        
        const resa = await Reservation.findByIdAndUpdate(reservationId, { dateDebut: date, dateFin: endingDate, dinersNumber: dinersNumber.toString(), updatedAt: new Date() });
        
        console.log("reservationId", reservationId);
        
        res.status(200).json(resa);
    } catch (error) {
        console.log(error);
        
        res.status(400).json(error);
    }
}
);

router.delete("/:id", auth, async (req, res) => {
    
    const reservationId = req.params.id;
    
    try {
        
        const resa = await Reservation.findByIdAndDelete(reservationId);
        res.status(200).json(resa);
    } catch (error) {
        console.log(error);
        
        res.status(400).json(error);
    }
}
);

router.get("/all", auth, async (req, res) => {
    try {
        if (req.user.role.includes("admin")) {
            const reservations = await Reservation.find();
            res.status(200).json(reservations);
        } else {
            res.status(401).send("Access forbidden");
        }
    } catch (error) {
        console.log(error);
        
        res.status(400).json(error);
    }
}
);

module.exports = router;