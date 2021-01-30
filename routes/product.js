const express = require("express");
const router = express.Router();
const {
  getProductById,
  getProduct,
  createProduct,
  photo,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getAllUniqueCategories,
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { route } = require("./auth");

// all of params
router.param("productId", getProductById);
router.param("userId", getUserById);

// all actual routes
// Create route
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

// read routes
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

// Delete route
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

// update route
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

// List route
route.get("/products", getAllProducts);

router.get("/products/categories", getAllUniqueCategories);

// this is for export our route
module.exports = router;
