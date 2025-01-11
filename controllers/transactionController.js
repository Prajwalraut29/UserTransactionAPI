const Transaction = require('../models/Transaction');

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
            matchCriteria.transactionDate.$gte = new Date(fromDate);
        }
        if (toDate) {
            matchCriteria.transactionDate.$lt = new Date(new Date(toDate).setDate(new Date(toDate).getDate() + 1));
        }
    }

    return matchCriteria;
};

exports.getTransactionsForUser = async (req, res) => {
    const { userId } = req.params;
    const { status, fromDate, toDate, type, page = 1, limit = 10 } = req.query;

    try {

        const matchCriteria = buildMatchCriteria(userId, { status, fromDate, toDate, type });

        const transactions = await Transaction.aggregate([
            { $match: matchCriteria },
            { $sort: { transactionDate: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: parseInt(limit) },
        ]);

        const totalTransactionsResult = await Transaction.aggregate([
            { $match: matchCriteria },
            { $count: "total" }
        ]);

        const totalTransactions = totalTransactionsResult.length > 0 ? totalTransactionsResult[0].total : 0;

        res.json({
            totalTransactions,
            totalPages: Math.ceil(totalTransactions / limit),
            currentPage: parseInt(page),
            transactions,
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: error.message });
    }
};


exports.getAllTransactionsWithUserDetails = async (req, res) => {
    const { status, fromDate, toDate, type, page = 1, limit = 10 } = req.query;

    try {
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
                matchCriteria.transactionDate.$gte = new Date(fromDate);
            }
            if (toDate) {
                matchCriteria.transactionDate.$lt = new Date(new Date(toDate).setDate(new Date(toDate).getDate() + 1));
            }
        }


        const transactions = await Transaction.aggregate([
            { $match: matchCriteria },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            },
            { $unwind: '$userDetails' },
            { $sort: { transactionDate: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: parseInt(limit) },
        ]);

        const totalTransactions = await Transaction.countDocuments(matchCriteria);

        res.json({
            totalTransactions,
            totalPages: Math.ceil(totalTransactions / limit),
            currentPage: parseInt(page),
            transactions,
        });
    } catch (error) {
        console.error('Error fetching transactions with user details:', error);
        res.status(500).json({ message: error.message });
    }
};