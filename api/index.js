const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Transaction = require('./models/Transaction.js');
const mongoose = require("mongoose");
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/transaction', async (req, res) =>{

    await mongoose.connect(process.env.MONGO_URL);
    const {price, name, description, datetime} = req.body;
    const transaction = await Transaction.create({price, name,description,datetime});
    res.json(transaction);
});

app.get('/api/transactions', async (req,res) => {
    
    await mongoose.connect(process.env.MONGO_URL);
    const transactions = await Transaction.find();
    res.json(transactions)
});


app.listen(4000);