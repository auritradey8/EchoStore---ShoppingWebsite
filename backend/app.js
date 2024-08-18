const express = require("express");
const app = express();
app.use(express.json())

//ROUTE IMPORT
const product =require("./router/productRoute")
app.use("/api/v1",product);


module.exports= app