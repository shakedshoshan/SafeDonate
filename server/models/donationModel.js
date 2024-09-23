const mongoose = require('mongoose');

const donationSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        associationName: {
            type: String,
            required: true,
        },
        associationNumber: {
            type: Number,
            required: true,
        },
        amount: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Donation', donationSchema);