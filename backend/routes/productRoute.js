const express =require("express");
const { getAllProducts,createProduct,updateProduct,deleteProduct,getProductDetails, createProductReview, getProductReviews, deleteReview} = require("../controllers/productController");
const { isAuthenticateUser, authorizeRoles } = require("../middleware/auth");


const router= express.Router();

router.route("/products").get( getAllProducts);
router.route("/admin/products/new").post(isAuthenticateUser,authorizeRoles("admin"),createProduct);
router.route("/admin/products/:id")
.put(isAuthenticateUser,authorizeRoles("admin"),updateProduct)
.delete(isAuthenticateUser,authorizeRoles("admin"),deleteProduct);

router.route("/review").put(isAuthenticateUser,createProductReview)


router.route("/products/:id").get(getProductDetails);


router.route("/reviews").get(getProductReviews).delete(isAuthenticateUser,deleteReview);
module.exports=router;
