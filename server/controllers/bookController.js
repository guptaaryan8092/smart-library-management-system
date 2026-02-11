const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');

// @desc    Create a new book
// @route   POST /api/books
// @access  Private/Admin
const createBook = asyncHandler(async (req, res) => {
    const { title, author, category, type, serialNo, cost, procurementDate } = req.body;

    // Check if book with serial number already exists
    const bookExists = await Book.findOne({ serialNo });

    if (bookExists) {
        res.status(400);
        throw new Error('Book with this serial number already exists');
    }

    // Create book
    const book = await Book.create({
        title,
        author,
        category,
        type,
        serialNo,
        cost,
        procurementDate: procurementDate || Date.now(),
    });

    res.status(201).json({
        success: true,
        data: book,
    });
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        res.status(404);
        throw new Error('Book not found');
    }

    // If serial number is being updated, check it doesn't exist
    if (req.body.serialNo && req.body.serialNo !== book.serialNo) {
        const serialExists = await Book.findOne({ serialNo: req.body.serialNo });
        if (serialExists) {
            res.status(400);
            throw new Error('Book with this serial number already exists');
        }
    }

    // Update book
    const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.json({
        success: true,
        data: updatedBook,
    });
});

// @desc    Get all books
// @route   GET /api/books
// @access  Private
const getAllBooks = asyncHandler(async (req, res) => {
    const { type, category, isAvailable } = req.query;

    // Build filter object
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';

    const books = await Book.find(filter).sort({ createdAt: -1 });

    res.json({
        success: true,
        count: books.length,
        data: books,
    });
});

// @desc    Get available books
// @route   GET /api/books/available
// @access  Private
const getAvailableBooks = asyncHandler(async (req, res) => {
    const { type, category } = req.query;

    // Build filter object with isAvailable = true
    const filter = { isAvailable: true };
    if (type) filter.type = type;
    if (category) filter.category = category;

    const books = await Book.find(filter).sort({ createdAt: -1 });

    res.json({
        success: true,
        count: books.length,
        data: books,
    });
});

module.exports = {
    createBook,
    updateBook,
    getAllBooks,
    getAvailableBooks,
};
