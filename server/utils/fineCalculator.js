/**
 * Calculate fine amount based on days late
 * @param {Date} returnDate - Expected return date
 * @param {Date} actualReturnDate - Actual return date
 * @returns {number} Fine amount (₹10 per day late)
 */
const calculateFine = (returnDate, actualReturnDate) => {
    if (!actualReturnDate || !returnDate) {
        return 0;
    }

    const expectedReturn = new Date(returnDate);
    const actualReturn = new Date(actualReturnDate);

    // Set time to midnight for accurate day calculation
    expectedReturn.setHours(0, 0, 0, 0);
    actualReturn.setHours(0, 0, 0, 0);

    if (actualReturn > expectedReturn) {
        const daysLate = Math.ceil((actualReturn - expectedReturn) / (1000 * 60 * 60 * 24));
        return daysLate * 10; // ₹10 per day
    }

    return 0;
};

module.exports = calculateFine;
