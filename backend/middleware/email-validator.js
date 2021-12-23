const emailValidator = require("email-validator");

module.exports = (req, res, next) => {
    try {
        const testEmail = emailValidator.validate(req.body.email);
        if (!testEmail) {
            throw '400: email incorrect';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error });
    }
}