const express =require("express");
const { getAllProducts } = require("../controllers/productController");


const router= express.Router();



module.exports=router;router.route("/products").get(getAllProducts);