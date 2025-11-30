// backend/utils/generateToken.js
import jwt from 'jsonwebtoken';

/**
 * Generates a JWT and sets it as an HTTP-only cookie in the response.
 * @param {object} res - The Express response object.
 * @param {string} userId - The ID of the user to encode in the token payload.
 */
const generateToken = (res, userId) => {
    // 1. Create the JSON Web Token (JWT)
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });

    // 2. Set the token as a secure HTTP-only cookie
    res.cookie('jwt', token, {
        httpOnly: true, // Prevents client-side JavaScript access (security)
        secure: process.env.NODE_ENV !== 'development', // Use HTTPS in production
        sameSite: 'strict', // Prevents CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });
};

export default generateToken;