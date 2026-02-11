const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: [true, 'Book ID is required'],
        },
        issueDate: {
            type: Date,
            required: [true, 'Issue date is required'],
        },
        returnDate: {
            type: Date,
            required: [true, 'Return date is required'],
        },
        actualReturnDate: {
            type: Date,
            default: null,
        },
        fineAmount: {
            type: Number,
            default: 0,
            min: [0, 'Fine amount cannot be negative'],
        },
        finePaid: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['Issued', 'Returned'],
            default: 'Issued',
        },
    },
    {
        timestamps: true,
    }
);

// Method to calculate fine (₹10 per day late)
issueSchema.methods.calculateFine = function () {
    if (!this.actualReturnDate || !this.returnDate) {
        return 0;
    }

    const returnDate = new Date(this.returnDate);
    const actualReturnDate = new Date(this.actualReturnDate);

    // Set time to midnight for accurate day calculation
    returnDate.setHours(0, 0, 0, 0);
    actualReturnDate.setHours(0, 0, 0, 0);

    if (actualReturnDate > returnDate) {
        const daysLate = Math.ceil((actualReturnDate - returnDate) / (1000 * 60 * 60 * 24));
        return daysLate * 10; // ₹10 per day
    }

    return 0;
};

// Method to check if issue is overdue
issueSchema.methods.isOverdue = function () {
    if (this.actualReturnDate || this.status === 'Returned') {
        return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const returnDate = new Date(this.returnDate);
    returnDate.setHours(0, 0, 0, 0);

    return today > returnDate;
};

// Indexes for faster queries
issueSchema.index({ userId: 1, status: 1 });
issueSchema.index({ bookId: 1 });
issueSchema.index({ status: 1 });

module.exports = mongoose.model('Issue', issueSchema);
