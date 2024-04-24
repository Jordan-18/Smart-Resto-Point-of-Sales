const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); dotenv.config()
const secretKey = process.env.SECRET_KEY // Use the same secret key as in the login function

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Token is not valid' });
            }

            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = authenticateJWT;
