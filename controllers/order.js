const responseHandler = require("../helpers/response-handler");
const { Order } = require("../models/order");
const { OrderItem } = require("../models/order-item");
const validateObjectId = require("../helpers/object-id-validator");

const OrderController = {
  async getOrders(req, res) {
    await Order.find()
      .populate("user", "name")
      .sort("dateOrdered")
      .then((orders) => {
        if (orders) {
          responseHandler.found(res, orders);
        } else {
          responseHandler.notfound(res, "Orders not found");
        }
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },
  async getOrderById(req, res) {
    await Order.findById(req.params.id)
      .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      }).sort({'dateOrdered':-1})
      .then((order) => {
        if (order) {
          responseHandler.found(res, order);
        } else {
          responseHandler.notfound(res, "Order not found");
        }
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },
  async getOrderItems(req, res) {
    await OrderItem.find()
      .then((orderitems) => {
        if (orderitems) {
          responseHandler.found(res, orderitems);
        } else {
          responseHandler.notfound(res, "Order items not found");
        }
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },
  async createOrder(req, res) {
    const orderItemIds =await Promise.all(
      req.body.orderItems.map(async (orderitem) => {
        let newOrderItem = new OrderItem({
          quantity: orderitem.quantity,
          product: orderitem.productId,
        });

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
      })
    );

    //promise all to single promise
    

    const totalPrices = await Promise.all(orderItemIds.map(async orderItemId=>{
      const orderItem = await OrderItem.findById(orderItemId).populate("product","price")
      const totalprice = orderItem.product.price * orderItem.quantity

      return totalprice
    }))

    const totalPrice = totalPrices.reduce((a,b)=> a+b, 0)

    req.body.orderItems = orderItemIds;
    req.body.totalPrice = totalPrice
    let order = new Order(req.body);
    order = await order.save();

    if (!order) {
      responseHandler.badrequest(res, "Order cannot be placed");
    }

    responseHandler.added(res, "Order successfully placed");
  },

  async updateOrderStatus(req, res) {
    validateObjectId(res, req.params.id);
    await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: req.body.status,
        },
      },
      { new: true }
    )
      .then((updatedOrder) => {
        if (updatedOrder) {
          responseHandler.updated(res, "Order has been successfully updated.");
        } else {
          responseHandler.notfound(res, "Order not found");
        }
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },
  async deleteOrder(req, res) {
    validateObjectId(res, req.params.id);
    await Order.findByIdAndRemove(req.params.id)
      .then(async (deletedOrder) => {
        if (deletedOrder) {
          await deletedOrder.orderItems.map(async (orderItem) => {
            await OrderItem.findByIdAndRemove(orderItem);
          });
          responseHandler.deleted(res, "Order deleted successfully");
        } else {
          responseHandler.notfound(res, "Order not found");
        }
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },

  async getTotalSales(req,res){
    await Order.aggregate([
      {
        $group:{
          _id:null,
          totalsales: {$sum:"$totalPrice"}
        }
      }
    ]).then(totalSales=>{
      if(totalSales){
        responseHandler.found(res,{totalSales:totalSales.pop().totalsales})
      }else{
        responseHandler.notfound(res,"Total sales cannot be generated")
      }
    }).catch(err=>{
      responseHandler.error(res,err)
    })
  },
  async getOrdersCount(req, res) {
    await Order.countDocuments().then((count) => {
     if(count>0){
      responseHandler.found(res, {
        ordersCount: count,
      });
     }else{
      responseHandler.notfound(res, "No orders found");
     }
    }).catch((err) => {
      responseHandler.error(res, err);
    });
  },
  async getOrderByUser(req, res) {
    await Order.find({user:req.params.userId})
    .select("-user")
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      }).sort({'dateOrdered':-1})
      .then((userOrder) => {
        if (userOrder) {
          responseHandler.found(res, userOrder);
        } else {
          responseHandler.notfound(res, "User hasn't ordered yet");
        }
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },
};

module.exports = OrderController;
