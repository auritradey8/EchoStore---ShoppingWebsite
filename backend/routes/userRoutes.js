const express = require("express");
const { registerUser, loginUser, logout,forgetPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateRole, deleteUser } = require("../controllers/userController");

const { isAuthenticateUser , authorizeRoles } = require("../middleware/auth");


const router =express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgetPassword);

router.route("/logout").get(logout);

router.route("/password/reset/:token").put(resetPassword);


router.route("/me").get(isAuthenticateUser,getUserDetails);

router.route("/password/update").put(isAuthenticateUser,updatePassword);

router.route("/me/update").put(isAuthenticateUser,updateProfile);


router.route("/admin/users").get(isAuthenticateUser,authorizeRoles('admin'),getAllUser);

router.route("/admin/user/:id").get(isAuthenticateUser,authorizeRoles('admin'),getSingleUser).put(isAuthenticateUser,authorizeRoles('admin'),updateRole).delete(isAuthenticateUser,authorizeRoles('admin'),deleteUser);

module.exports = router; 