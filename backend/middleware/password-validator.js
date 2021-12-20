const passwordSchema = require('../models/Password-validator');

module.exports = (req, res, next) => {
    try {
        const testPassword = passwordSchema.validate(req.body.password);
        if (!testPassword) {
            throw '400: mot de passe pas assez sécurisé';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error });
    }
}