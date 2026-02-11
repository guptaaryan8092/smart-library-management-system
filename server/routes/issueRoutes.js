const express = require('express');
const router = express.Router();
const {
    issueBook,
    returnBook,
    payFine,
    getUserIssues,
} = require('../controllers/issueController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.post('/', protect, issueBook);
router.post('/return/:id', protect, returnBook);
router.post('/payfine/:id', protect, payFine);
router.get('/user/:userId', protect, getUserIssues);

module.exports = router;
