const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');
const User = require('../models/User');
const Issue = require('../models/Issue');

// @desc    Get all books report
// @route   GET /api/reports/books
// @access  Private
const getBooks = asyncHandler(async (req, res) => {
    const books = await Book.find({ type: 'Book' }).sort({ createdAt: -1 });

    res.json({
        success: true,
        count: books.length,
        data: books,
    });
});

// @desc    Get all movies report
// @route   GET /api/reports/movies
// @access  Private
const getMovies = asyncHandler(async (req, res) => {
    const movies = await Book.find({ type: 'Movie' }).sort({ createdAt: -1 });

    res.json({
        success: true,
        count: movies.length,
        data: movies,
    });
});

// @desc    Get all memberships report
// @route   GET /api/reports/memberships
// @access  Private/Admin
const getMemberships = asyncHandler(async (req, res) => {
    const users = await User.find({ role: 'user' })
        .select('-password')
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        count: users.length,
        data: users,
    });
});

// @desc    Get all active issues report
// @route   GET /api/reports/active-issues
// @access  Private
const getActiveIssues = asyncHandler(async (req, res) => {
    const issues = await Issue.find({ status: 'Issued' })
        .populate('userId', 'name email membershipNumber')
        .populate('bookId', 'title author serialNo type')
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        count: issues.length,
        data: issues,
    });
});

// @desc    Get overdue issues report
// @route   GET /api/reports/overdue
// @access  Private
const getOverdueIssues = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find issues where returnDate < today AND actualReturnDate is null
    const overdueIssues = await Issue.find({
        returnDate: { $lt: today },
        actualReturnDate: null,
        status: 'Issued',
    })
        .populate('userId', 'name email membershipNumber')
        .populate('bookId', 'title author serialNo type')
        .sort({ returnDate: 1 });

    // Calculate days overdue for each issue
    const issuesWithOverdueDays = overdueIssues.map(issue => {
        const returnDate = new Date(issue.returnDate);
        returnDate.setHours(0, 0, 0, 0);
        const daysOverdue = Math.ceil((today - returnDate) / (1000 * 60 * 60 * 24));
        const estimatedFine = daysOverdue * 10;

        return {
            ...issue.toObject(),
            daysOverdue,
            estimatedFine,
        };
    });

    res.json({
        success: true,
        count: issuesWithOverdueDays.length,
        data: issuesWithOverdueDays,
    });
});

module.exports = {
    getBooks,
    getMovies,
    getMemberships,
    getActiveIssues,
    getOverdueIssues,
};
