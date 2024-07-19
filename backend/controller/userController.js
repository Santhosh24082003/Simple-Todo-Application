const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const userSchema = require("../models/userModal");

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    console.log('Register request body:', req.body);

    if (!username || !email || !password || !confirmPassword) {
        res.status(400);
        throw new Error("Please fill all the fields");
    }

    if (confirmPassword !== password) {
        res.status(400);
        throw new Error("Password and confirmPassword do not match");
    }

    const userExist = await userSchema.findOne({ email });

    if (userExist) {
        res.status(400);
        throw new Error("The user already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userSchema.create({
        username,
        email,
        password: hashedPassword,
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log('Login request body:', req.body);

    const user = await userSchema.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid email or password');
    }
});

const getMe = asyncHandler(async (req, res) => {
    const { id } = req.user;
    console.log('GetMe request user:', req.user);

    const user = await userSchema.findById(id);
    
    if (user) {
        res.status(200).json({
            _id: user.id,
            username: user.username,
            email: user.email,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not set");
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
