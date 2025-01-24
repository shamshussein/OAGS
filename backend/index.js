const express = require("express");
const cors = require('cors');
const app = express();

const productRouter = require('./routers/productRouter');
const userRouter = require('./routers/userRouter');
const feedbackRouter = require('./routers/feedbackRouter');
const bundlesRouter = require('./routers/bundlesRouter');
const cartRouter = require('./routers/cartRouter')

const DB = require("./database").connectDB;

app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST"],
}));

app.use(express.json()); 

DB();

app.use('/api/products', productRouter); 
app.use('/api/users', userRouter); 
app.use('/api/feedbacks', feedbackRouter); 
app.use('/api/bundles', bundlesRouter); 

app.use('/api/carts', cartRouter); 

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
