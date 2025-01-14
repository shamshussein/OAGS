const express = require("express");
const cors = require('cors');
const app = express();

const productRouter = require('./routers/productRouter');

const DB = require("./database").connectDB;

app.use(cors());
app.use(express.json()); 

DB();

app.use('/api/products', productRouter); 

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
