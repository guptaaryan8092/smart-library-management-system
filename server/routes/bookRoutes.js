const express = require('express');
const router = express.Router();
const {
    createBook,
    updateBook,
    getAllBooks,
    getAvailableBooks,
} = require('../controllers/bookController');
const { protect, isAdmin } = require('../middleware/auth');

// Protected routes
router.route('/')
    .post(protect, isAdmin, createBook)
    .get(protect, getAllBooks);

router.get('/available', protect, getAvailableBooks);

router.put('/:id', protect, isAdmin, updateBook);

module.exports = router;
