const Transaction = require('../models/Transaction');

// Utility function to build match criteria
const buildMatchCriteria = (userId, filters) => {
    const { status, fromDate, toDate, type } = filters;
    const matchCriteria = { userId };

    if (status) {
        matchCriteria.status = status;
    }

    if (type) {
        matchCriteria.type = type;
    }

    if (fromDate || toDate) {
        matchCriteria.transactionDate = {};
        if (fromDate) {
            matchCriteria.transactionDate.$gte = new Date(fromDate); // Start date inclusive
        }
        if (toDate) {
            matchCriteria.transactionDate.$lt = new Date(new Date(toDate).setDate(new Date(toDate).getDate() + 1)); // End date exclusive
        }
    }

    return matchCriteria;
};

// Get all transactions for a user with filters
exports.getTransactionsForUser = async (req, res) => {
    const { userId } = req.params; // Extract userId from request parameters
    const { status, fromDate, toDate, type, page = 1, limit = 10 } = req.query; // Extract query parameters

    try {
        // Build the match criteria based on filters
        const matchCriteria = buildMatchCriteria(userId, { status, fromDate, toDate, type });


        // Aggregate transactions based on the match criteria
        const transactions = await Transaction.aggregate([
            { $match: matchCriteria },
            { $sort: { transactionDate: -1 } }, // Sort by transaction date descending
            { $skip: (page - 1) * limit }, // Pagination
            { $limit: parseInt(limit) }, // Limit results
        ]);

        // Count total transactions matching criteria for pagination
        const totalTransactionsResult = await Transaction.aggregate([
            { $match: matchCriteria },
            { $count: "total" } // Count documents
        ]);

        const totalTransactions = totalTransactionsResult.length > 0 ? totalTransactionsResult[0].total : 0;

        res.json({
            totalTransactions,
            totalPages: Math.ceil(totalTransactions / limit),
            currentPage: parseInt(page),
            transactions,
        });
    } catch (error) {
        console.error('Error fetching transactions:', error); // Log error for debugging
        res.status(500).json({ message: error.message }); // Send error response
    }
};


exports.getAllTransactionsWithUserDetails = async (req, res) => {
    const { status, fromDate, toDate, type, page = 1, limit = 10 } = req.query; // Extract query parameters

    try {
        // Build match criteria for filtering
        const matchCriteria = {};

        if (status) {
            matchCriteria.status = status;
        }

        if (type) {
            matchCriteria.type = type;
        }

        if (fromDate || toDate) {
            matchCriteria.transactionDate = {};
            if (fromDate) {
                matchCriteria.transactionDate.$gte = new Date(fromDate); // Start date inclusive
            }
            if (toDate) {
                matchCriteria.transactionDate.$lt = new Date(new Date(toDate).setDate(new Date(toDate).getDate() + 1)); // End date exclusive
            }
        }

        // Aggregate transactions with user details
        const transactions = await Transaction.aggregate([
            { $match: matchCriteria }, // Match based on criteria
            {
                $lookup: {
                    from: 'users', // The name of the users collection
                    localField: 'userId', // Field from the transactions collection
                    foreignField: '_id', // Field from the users collection
                    as: 'userDetails', // Output array field for user details
                },
            },
            { $unwind: '$userDetails' }, // Unwind userDetails to flatten the structure
            { $sort: { transactionDate: -1 } }, // Sort by transaction date descending
            { $skip: (page - 1) * limit }, // Pagination
            { $limit: parseInt(limit) }, // Limit results
        ]);

        // Count total transactions matching criteria for pagination
        const totalTransactions = await Transaction.countDocuments(matchCriteria);

        res.json({
            totalTransactions,
            totalPages: Math.ceil(totalTransactions / limit),
            currentPage: parseInt(page),
            transactions,
        });
    } catch (error) {
        console.error('Error fetching transactions with user details:', error); // Log error for debugging
        res.status(500).json({ message: error.message }); // Send error response
    }
};