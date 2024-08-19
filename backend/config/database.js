const mongoose =require("mongoose");


// connection creation and creation a new database
const connectDatabase =()=>{
    mongoose.connect(process.env.DB_URI).then((data)=>{

        console.log(`mongodb connected with ${data.connection.host}`)
    }).catch((err)=>{
        console.log(err)
    })
}

module.exports  = connectDatabase