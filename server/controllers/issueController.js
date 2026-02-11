const asyncHandler = require('express-async-handler');
const Issue = require('../models/Issue');
const Book = require('../models/Book');
const User = require('../models/User');
const calculateFine = require('../utils/fineCalculator');

// @desc    Issue a book to user
// @route   POST /api/issues
// @access  Private
const issueBook = asyncHandler(async (req, res) => {
    const { bookId, issueDate, returnDate } = req.body;
    const userId = req.body.userId || req.user._id; // Allow admin to issue for others

    // Validate required fields
    if (!bookId || !issueDate || !returnDate) {
        res.status(400);
        throw new Error('Please provide bookId, issueDate, and returnDate');
    }

    // 1. Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
        res.status(404);
        throw new Error('Book not found');
    }

    if (!book.isAvailable) {
        res.status(400);
        throw new Error('Book is not available for issue');
    }

    // 2. Check if user exists and membership is active
    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (!user.isMembershipActive()) {
        res.status(400);
        throw new Error('User membership is not active or has expired');
    }

    // 3. Validate issue date (must be >= today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const issueDateObj = new Date(issueDate);
    issueDateObj.setHours(0, 0, 0, 0);

    if (issueDateObj < today) {
        res.status(400);
        throw new Error('Issue date cannot be before today');
    }

    // 4. Validate return date (must be <= issueDate + 15 days)
    const returnDateObj = new Date(returnDate);
    const maxReturnDate = new Date(issueDateObj);
    maxReturnDate.setDate(maxReturnDate.getDate() + 15);

    if (returnDateObj > maxReturnDate) {
        res.status(400);
        throw new Error('Return date cannot exceed 15 days from issue date');
    }

    // 5. Check if user has less than 3 active issues
    const activeIssues = await Issue.countDocuments({
        userId,
        status: 'Issued',
    });

    if (activeIssues >= 3) {
        res.status(400);
        throw new Error('User has already issued maximum 3 books');
    }

    // Create issue
    const issue = await Issue.create({
        userId,
        bookId,
        issueDate,
        returnDate,
    });

    // Update book availability
    book.isAvailable = false;
    await book.save();

    // Populate issue data
    const populatedIssue = await Issue.findById(issue._id)
        .populate('userId', 'name email membershipNumber')
        .populate('bookId', 'title author serialNo type');

    res.status(201).json({
        success: true,
        data: populatedIssue,
    });
});

// @desc    Return a book
// @route   POST /api/issues/return/:id
// @access  Private
const returnBook = asyncHandler(async (req, res) => {
    const issue = await Issue.findById(req.params.id)
        .populate('userId', 'name email')
        .populate('bookId', 'title author serialNo');

    if (!issue) {
        res.status(404);
        throw new Error('Issue record not found');
    }

    // Check if already returned
    if (issue.status === 'Returned') {
        res.status(400);
        throw new Error('Book has already been returned');
    }

    // Check authorization (users can only return their own books, admin can return any)
    if (req.user.role !== 'admin' && issue.userId._id.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to return this book');
    }

    // Set actual return date
    const actualReturnDate = req.body.actualReturnDate || new Date();
    issue.actualReturnDate = actualReturnDate;

    // Calculate fine
    const fine = calculateFine(issue.returnDate, actualReturnDate);
    issue.fineAmount = fine;

    await issue.save();

    res.json({
        success: true,
        message: fine > 0
            ? `Book returned. Fine amount: ₹${fine}. Please pay the fine to complete the return process.`
            : 'Book returned successfully with no fine.',
        data: issue,
    });
});

// @desc    Pay fine and complete return
// @route   POST /api/issues/payfine/:id
// @access  Private
const payFine = asyncHandler(async (req, res) => {
    const issue = await Issue.findById(req.params.id)
        .populate('userId', 'name email')
        .populate('bookId', 'title author serialNo');

    if (!issue) {
        res.status(404);
        throw new Error('Issue record not found');
    }

    // Check authorization
    if (req.user.role !== 'admin' && issue.userId._id.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to pay this fine');
    }

    // Check if already completed
    if (issue.status === 'Returned' && issue.finePaid) {
        res.status(400);
        throw new Error('Fine has already been paid');
    }

    // Check if book has been returned
    if (!issue.actualReturnDate) {
        res.status(400);
        throw new Error('Book has not been returned yet');
    }

    // If there's a fine, mark it as paid
    if (issue.fineAmount > 0) {
        issue.finePaid = true;
    }

    // Update issue status
    issue.status = 'Returned';

    // Update book availability
    const book = await Book.findById(issue.bookId._id);
    if (book) {
        book.isAvailable = true;
        await book.save();
    }

    await issue.save();

    res.json({
        success: true,
        message: issue.fineAmount > 0
            ? `Fine of ₹${issue.fineAmount} paid successfully. Book return completed.`
            : 'Book return completed successfully.',
        data: issue,
    });
});

// @desc    Get user's issues
// @route   GET /api/issues/user/:userId
// @access  Private
const getUserIssues = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    // Users can only view their own issues, admin can view all
    if (req.user.role !== 'admin' && userId !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to view these issues');
    }

    const issues = await Issue.find({ userId })
        .populate('bookId', 'title author serialNo type')
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        count: issues.length,
        data: issues,
    });
});

module.exports = {
    issueBook,
    returnBook,
    payFine,
    getUserIssues,
};
