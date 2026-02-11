const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
    const { name, email, password, role, membershipType } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Validate role
    if (role && role !== 'admin' && role !== 'user') {
        res.status(400);
        throw new Error('Invalid role specified');
    }

    // For regular users, membership type is required
    if ((!role || role === 'user') && !membershipType) {
        res.status(400);
        throw new Error('Membership type is required for users');
    }

    // Create user data object
    const userData = {
        name,
        email,
        password,
        role: role || 'user',
    };

    // Add membership details for regular users
    if (userData.role === 'user') {
        userData.membershipType = membershipType;
    }

    // Create user (password will be hashed by pre-save hook)
    const user = await User.create(userData);

    if (user) {
        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                membershipNumber: user.membershipNumber,
                membershipType: user.membershipType,
                membershipExpiry: user.membershipExpiry,
                isActive: user.isActive,
                token: generateToken(user._id),
            },
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    // Check for user
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                membershipNumber: user.membershipNumber,
                membershipType: user.membershipType,
                membershipExpiry: user.membershipExpiry,
                isActive: user.isActive,
                token: generateToken(user._id),
            },
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

module.exports = {
    register,
    login,
};
