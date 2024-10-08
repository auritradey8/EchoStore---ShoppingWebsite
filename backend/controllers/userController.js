const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const User =require("../models/userModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken= require("../utils/jwtToken")
const sendEmail =require("../utils/sendEmail")

//Register a User 
exports.registerUser =catchAsyncErrors(async (req,res,next)=>{
    const { name, email, password } =req.body;

    const user =await User.create({
        name, 
        email,
        password,
        avatar:{
            public_id: "this is a sample id",
            url: "profilepicUrl",
        },
    });


    sendToken(user,201,res);

//     const token = user.getJWTToken();


// res.status(201).json({
//     success:true,
//     token,
// });

});


//login user 
exports.loginUser =catchAsyncErrors(async (req,res,next)=>{
    const {email , password}=req.body;

    //checking if user has given password and email both
    
    if(!email || !password){
        return next(new ErrorHander("Please enter email and password",400));

    }
    const user = await  User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHander("Invalid email or password",401));
    }
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHander("Invalid email or password",401));
    }

    sendToken(user,200,res);
   
    // const token =user.getJWTToken();
    // res.status(200).json({
    //     success:true,
    //     token,
    // });
});


// Logout user

exports.logout = catchAsyncErrors(async (req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    });

    res.status(200).json({
        success:true,message:"Logged out",
    });
});

//forget password 
exports.forgetPassword = catchAsyncErrors(async (req,res,next)=>{
    const user =await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHander("User not found",404));
    }

    //get resetpassword token
    const resetToken=user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl =`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message =`Your password reset token is :-\n\n  ${resetPasswordUrl}  if you are not requested this email then, pleasee ignore it`;
    
      try {

        await sendEmail({
            email:user.email,
            subject:`Ecommerce Password Recovery`,
            message,   
        });
        
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
        });
      } catch (error) {
        user.resetPasswordToken =undefined;
        user.resetPasswordExpire = undefined;
        

        await user.save({validateBeforesave:false});
        return next(new ErrorHander(error.message,500));

      }



});


//reset Password
exports.resetPassword = catchAsyncErrors(async(req,res,next) =>{
    //creating token hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest('hex');
const user =await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt:Date.now()},

});

if(!user){
    return next(new ErrorHander("Reset Password Token is invalid or has been expired"));
}

if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHander("Password does not match",400));
}

user.password=req.body.password;
user.resetPasswordToken=undefined;
user.resetPasswordToken =undefined;
 

await user.save();

sendToken(user,200,res);

})

//get user details
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user =await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user,
    });
});

//update user password 
exports.updatePassword = catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched= await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched)
    {
        return next(new ErrorHander("old password is incorrect ", 400));

    }

    if(req.body.newPassword !== req.body.confirmPassword){

        return next(new ErrorHander("Password does not match",400));

    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user,200,res);
     
})


//update user profile 
exports.updateProfile = catchAsyncErrors(async (req,res,next)=>{
    
    const newUserData ={
        name:req.body.name,
        email:req.body.email,
    }

    //we will add cloudinary later 


    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

    

    res.status(200).json({
        success:true,
    });
     
})


//Get all users(admin)
exports.getAllUser = catchAsyncErrors(async (req,res,next)=>{
     const users =await User.find();

     res.status(200).json({
        success:true,
        users,
     });


});

//Get single user(admin)
exports.getSingleUser = catchAsyncErrors(async (req,res,next)=>{
    const user =await User.findById(req.params.id);

    if(!user){
        return next(
            new ErrorHander(`User does not exist with Id:${req.params.id}`)
        );

    }

    res.status(200).json({
        success:true,
        user,
    });
});


//update user role  -- admin 
exports.updateRole = catchAsyncErrors(async (req,res,next)=>{
    
    const newUserData ={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }

    


    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

    

    res.status(200).json({
        success:true,
    });
     
})

//delete user role  -- admin 
exports.deleteUser = catchAsyncErrors(async (req,res,next)=>{
    
    const user =await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHander(`user does not exit with Id:${res.params.id}`));
    }
    await User.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
     
});




