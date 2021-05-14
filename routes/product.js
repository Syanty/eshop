const router = require("express").Router();
const ProductController = require("../controllers/product");

router.get(`/`, ProductController.getProducts);

router.post(`/`, ProductController.createProduct);

router.put(`/:id`, ProductController.updateProduct);

router.delete(`/:id`, ProductController.deleteProduct);

router.get(`/:id`, ProductController.getProduct);

router.get(`/get/count`, ProductController.getProductsCount);

router.get(`/get/featured`, ProductController.getFeaturedProducts);

router.get(
  `/get/featured/:count`,
  ProductController.getDynamicFeaturedProducts
);
module.exports = router;
