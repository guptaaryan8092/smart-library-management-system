const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a title'],
            trim: true,
        },
        author: {
            type: String,
            required: [true, 'Please provide an author'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Please provide a category'],
            trim: true,
        },
        type: {
            type: String,
            enum: {
                values: ['Book', 'Movie'],
                message: 'Type must be either Book or Movie',
            },
            required: [true, 'Please specify if this is a Book or Movie'],
        },
        serialNo: {
            type: String,
            required: [true, 'Please provide a serial number'],
            unique: true,
            trim: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        cost: {
            type: Number,
            required: [true, 'Please provide the cost'],
            min: [0, 'Cost cannot be negative'],
        },
        procurementDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
bookSchema.index({ type: 1, isAvailable: 1 });

module.exports = mongoose.model('Book', bookSchema);
