const { Category } = require("../models/category");
const responseHandler = require("../helpers/response-handler");
const validateObjectId = require("../helpers/object-id-validator");

const categoryController = {
  async getCategories(req, res) {
    await Category.find()
      .then((categories) => {
        if (categories) {
          responseHandler.found(res, categories);
        } else {
          responseHandler.notfound(res, "Categories not found");
        }
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },
  async createCategory(req, res) {
    const category = new Category(req.body);
    await category
      .save()
      .then(() => {
        responseHandler.added(res, "New category added successfully");
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },
  async deleteCategory(req, res) {
    validateObjectId(res, req.params.id);
    await Category.findByIdAndRemove(req.params.id)
      .then((deletedCategory) => {
        if (deletedCategory) {
          responseHandler.deleted(res, "Category deleted successfully");
        } else {
          responseHandler.notfound(res, "Category not found");
        }
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },
  async getCategory(req, res) {
    validateObjectId(res, req.params.id);
    await Category.findById(req.params.id)
      .then((category) => {
        if (category) {
          responseHandler.found(res, category);
        } else {
          responseHandler.notfound(res, "Category not found");
        }
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },
  async updateCategory(req, res) {
    validateObjectId(res, req.params.id);
    await Category.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          icon: req.body.icon,
          color: req.body.color,
        },
      },
      { new: true }
    )
      .then((updatedCategory) => {
        if (updatedCategory) {
          responseHandler.updated(res, "Category updated successfully");
        } else {
          responseHandler.notfound(res, "Category not found");
        }
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },
};

module.exports = categoryController;
