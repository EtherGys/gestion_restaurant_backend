const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../model/User');
const router = express.Router();

const roles = {
    CLIENT: 'client',
    ADMIN: 'admin'
}

router.post('/register', async (req, res) => {
    const {username, email, password} = req.body
    
    try {
        // vérifier si le user n'existe pas déjà avant de créer
        
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        const newUser = new user({
            username, 
            password: hashedPassword,
            email,
            role: [roles.CLIENT]
        })

        
        await newUser.save();
        res.status(201).json("User created successfully")
        
    } catch (error) {
        res.status(500).json("User could not be created :" + error)
    }
})


router.post("/login", async (req,res) => {
    const { email, password} = req.body;
    console.log("email, password", email, password);
    
    try {
        const currentUser = await user.findOne({email});
        console.log("currentUser", currentUser);
        
        if (!currentUser) {
            res.status(404).send("Le compte client n'a pas été récupéré")
        }
        
        const passwordMatch = await bcrypt.compare(password, currentUser.password);
        
        if (!passwordMatch) {
            res.status(401).send("L'utilisateur n'existe pas")
        }
        
        const token = jwt.sign({id: currentUser._id, username: currentUser.username, role: currentUser.role}, process.env.SECRET)
        res.json({token, currentUser});
        
    } catch (error) {
        res.status(500).send("User could not be created :" + error)
        
    }
})

module.exports = router;