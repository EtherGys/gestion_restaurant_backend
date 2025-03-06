const jwt = require('jsonwebtoken');

// middleware pour vérifier le token

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).send('token manquant');
    }
    
    try {
        const decryptToken = jwt.verify(token, process.env.SECRET);
        
        req.user = decryptToken;
        next();
    } catch (error) {
        return res.status(401).send('token invalide');
    }

}