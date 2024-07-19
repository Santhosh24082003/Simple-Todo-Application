const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const userSchema = require('../models/userModal');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            if (!token) {
                throw new Error('Token missing');
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!decoded || !decoded.id) {
                throw new Error('Invalid token');
            }

            // Get user from token
            req.user = await userSchema.findById(decoded.id).select('-password');
            if (!req.user) {
                throw new Error('User not found');
            }

            next();
        } catch (error) {
            console.error('Protect middleware error:', error.message);
            res.status(401);
            throw new Error('Not authorized');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect };
