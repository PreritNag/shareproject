const JWT = require("jsonwebtoken");

// Use environment variable for secret key (use a fallback for development)
const secret = process.env.JWT_SECRET || "mysecretkey";

// Function to create a token for the user
function createTokenuser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        balance: user.balance,
        name: user.name,
    };

    // Set token expiration (e.g., 1 hour)
    const token = JWT.sign(payload, secret, { expiresIn: '1h' });
    return token;
}   

// Function to validate the token
function validateToken(token) {
    try {
        const payload = JWT.verify(token, secret);
        return payload;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

module.exports = { createTokenuser, validateToken };
