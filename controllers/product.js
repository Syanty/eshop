const { Product } = require("../models/product");
const { Category } = require("../models/category");
const mongoose = require("mongoose");
const responseHandler = require("../helpers/response-handler");

const ProductController = {
  async getProducts(req, res) {
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }
    await Product.find(filter)
      .populate("category")
      .then((products) => {
        if (products) {
          responseHandler.found(res, products);
        } else {
          responseHandler.notfound(res, "Products not found");
        }
      });
  },
  async createProduct(req, res) {
    const category = Category.findOne(req.body.category);
    if (!category)
      return res.status(400).send({
        success: false,
        error: "Invalid Category",
      });
    const product = new Product(req.body);
    await product
      .save()
      .then(() => {
        responseHandler.added(res, "New product added successfully");
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },
  async updateProduct(req, res) {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid Product Id",
      });
    }
    const category = Category.findOne(req.body.category);
    if (!category)
      return res.status(400).send({
        success: false,
        error: "Invalid Category",
      });
    await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(() => {
        responseHandler.updated(res, "Product updated successfully");
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },
  async deleteProduct(req, res) {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid Product Id",
      });
    }
    await Product.findByIdAndRemove(req.params.id)
      .then(() => {
        responseHandler.deleted(res,"Product deleted successfully");
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },
  async getProduct(req, res) {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid Product Id",
      });
    }
    await Product.findById(req.params.id)
      .then((product) => {
        if (product) {
          responseHandler.found(res, product);
        } else {
          responseHandler.notfound(res, "Product not found");
        }
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },

  async getProductsCount(req, res) {
    await Product.countDocuments().then((count) => {
     if(count>0){
      responseHandler.found(res, {
        productsCount: count,
      });
     }else{
      responseHandler.notfound(res, "No products found");
     }
    }).catch((err) => {
      responseHandler.error(res, err);
    });
  },

  async getFeaturedProducts(req, res) {
    await Product.find({ isFeatured: true })
      .select("name image price rating")
      .populate("category", "name -_id")
      .then((products) => {
        if (products) {
          responseHandler.found(res, products);
        } else {
          responseHandler.notfound(res, "No featured products found");
        }
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },
  async getDynamicFeaturedProducts(req, res) {
    const count = req.params.count ? req.params.count : 0;
    await Product.find({ isFeatured: true })
      .select("name image price rating")
      .populate("category", "name -_id")
      .limit(+count)
      .then((products) => {
        if (products) {
          responseHandler.found(res, products);
        } else {
          responseHandler.notfound(res, "No featured products found");
        }
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },
};

module.exports = ProductController;
