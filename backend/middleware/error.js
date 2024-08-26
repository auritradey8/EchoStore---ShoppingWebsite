const ErrorHander = require("../utils/errorhander");


module.exports = (err,req,res,next)=>{
    err.statusCode= err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

// wrong Mongodb Id error
if(err.name === "CastError")
{
    const message =`Resource not found. Invalid:$(err.path)`;
    err = new ErrorHandler(message,400);
}

//Mongoose duplicate key error
if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];  // Get the field that caused the duplicate key error
    const message = `Duplicate ${field} Entered`;
    err = new ErrorHander(message, 400);
}

// wrong JWT  error
if(err.name === "JsonWebTokenError")
{
    const message =`Json web Token is invalid,Try again `;
    err = new ErrorHander(message,400);
}

// JWT EXPIRE error
if(err.name === "TokenExpiredError")
{
    const message =`Json web Token is expired,Try again`;
    err = new ErrorHander(message,400);
}


    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    })
}