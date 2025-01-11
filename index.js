const express = require('express');
const connectDB = require('./database/db');
const userRoutes = require('./routes/userRoutes')
const transactionRoutes = require('./routes/transactionRoutes')
const app = express()
const PORT = process.env.PORT || 5000;
// db connection 
connectDB()

// middleware 
app.use(express.json())

// routes
app.use('/api/users', userRoutes)
app.use('/api', transactionRoutes); // Use transaction routes under /api

app.listen(PORT, () => {
    console.log(`server running at ${PORT}`);
})