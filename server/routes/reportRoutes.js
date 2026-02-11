const express = require('express');
const router = express.Router();
const {
    getBooks,
    getMovies,
    getMemberships,
    getActiveIssues,
    getOverdueIssues,
} = require('../controllers/reportController');
const { protect, isAdmin } = require('../middleware/auth');

// All routes are protected
router.get('/books', protect, getBooks);
router.get('/movies', protect, getMovies);
router.get('/memberships', protect, isAdmin, getMemberships);
router.get('/active-issues', protect, getActiveIssues);
router.get('/overdue', protect, getOverdueIssues);

module.exports = router;
