const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter product Name"]
    },
    description:{
        type:String,
        required:[true,"Please enter product Description"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter product Price" ],
        maxLength:[8,"Price cannot exceed 8 character"]

    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        },
    }
],
    category:{
        type:String,
        required:[true,"Please Enter Product Category"],
    },
    Stock:{
        type:Number,
        required:[true,"Please Enter product Stock"],
        maxLength:[4,"Stock cannot exceed 4 characters"],
        default:0
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                require:true
             },
            name:{
                type:String,
                required:true,
            },
            rating:{
                type:Number,
                require:true

            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
       type:mongoose.Schema.ObjectId,
       ref:"User",
       require:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
    
})

module.exports = mongoose.model("Product",productSchema);