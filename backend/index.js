const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

const productRouter = require("./routers/productRouter");
const userRouter = require("./routers/userRouter");
const feedbackRouter = require("./routers/feedbackRouter");
const bundlesRouter = require("./routers/bundlesRouter");
const cartRouter = require("./routers/cartRouter");
const checkoutRouter = require("./routers/checkoutRouter");

const DB = require("./database").connectDB;

dotenv.config();

const app = express();

app.use(cors({
  origin: 
  // "https://outdooradventuregear.netlify.app" ||
 "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

DB();

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/feedbacks", feedbackRouter);
app.use("/api/bundles", bundlesRouter);
app.use("/api/carts", cartRouter);
app.use("/api/checkout", checkoutRouter);

app.get("/", (req, res) => {
  res.send("E-commerce API is running...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
