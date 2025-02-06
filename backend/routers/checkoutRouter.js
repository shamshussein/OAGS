const express = require("express");
const {
  processCheckout,
  cancelOrder,
  getOrders,
  completedOrder,
  reorderOrder  
} = require("../controllers/checkoutController");
const { protect } = require("../controllers/userController");

const router = express.Router();

router.post("/", protect, processCheckout);
router.get("/getOrders", getOrders);
router.post("/cancelOrder/:orderId", protect, cancelOrder);
router.post("/completedOrder/:orderId", protect, completedOrder);
router.post("/reorder", protect, reorderOrder);

module.exports = router;
