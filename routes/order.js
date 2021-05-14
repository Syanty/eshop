const OrderController = require("../controllers/order");

const router = require("express").Router();

router.get("/", OrderController.getOrders);
router.get("/items", OrderController.getOrderItems);
router.post("/create", OrderController.createOrder);
router.get("/:id", OrderController.getOrderById);
router.put("/:id", OrderController.updateOrderStatus);
router.delete("/:id", OrderController.deleteOrder);
router.get("/get/totalsales",OrderController.getTotalSales);
router.get("/get/count", OrderController.getOrdersCount);
router.get("/get/userorders/:userId",OrderController.getOrderByUser);

module.exports = router;
