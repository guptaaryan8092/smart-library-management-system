const ApiResponse = require('../utils/ApiResponse');

const validateBookIssue = async (req, res, next) => {
    const { bookId, issueDate, returnDate } = req.body;

    // Validate required fields
    if (!bookId || !issueDate || !returnDate) {
        return ApiResponse.validationError(res, ['Book ID, issue date, and return date are required']);
    }

    // Validate dates
    const issue = new Date(issueDate);
    const returnD = new Date(returnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (issue < today) {
        return ApiResponse.validationError(res, ['Issue date cannot be in the past']);
    }

    // Max 15 days issue period
    const maxReturnDate = new Date(issue);
    maxReturnDate.setDate(maxReturnDate.getDate() + 15);

    if (returnD > maxReturnDate) {
        return ApiResponse.validationError(res, ['Return date cannot be more than 15 days from issue date']);
    }

    if (returnD <= issue) {
        return ApiResponse.validationError(res, ['Return date must be after issue date']);
    }

    next();
};

const validateFinePayment = (req, res, next) => {
    const { fine, finePaid } = req.body;

    // If there's a fine, ensure it's marked as paid
    if (fine > 0 && !finePaid) {
        return ApiResponse.validationError(res, ['Fine must be paid before completing return']);
    }

    next();
};

module.exports = {
    validateBookIssue,
    validateFinePayment,
};
