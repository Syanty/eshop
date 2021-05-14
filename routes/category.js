const router = require("express").Router();
const CategoryController = require("../controllers/category");
const { route } = require("./product");

router.get(`/`, CategoryController.getCategories);

router.post(`/`, CategoryController.createCategory);

router.delete(`/:id`, CategoryController.deleteCategory);

router.get(`/:id`, CategoryController.getCategory)

router.put(`/:id`,CategoryController.updateCategory)

module.exports = router;
