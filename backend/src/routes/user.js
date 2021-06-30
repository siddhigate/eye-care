const express = require("express");
const router = express.Router();

const { check } = require('express-validator');

const { getUserById, getUser, updateUser } = require("../controllers/user");
const {isSignedIn, isAuthenticated} = require("../controllers/auth");

router.param("userId", getUserById);

router.get("/user/:userId",  getUser);

router.put("/user/:userId",
//  [
    // check("name", "name should be atleast 3 characters").isLength({ min: 3}),
    // check("email").isEmail().withMessage("email is not valid"),
    // check("password", "password should be atleast 5 chars").isLength({ min : 5 })
// ], isSignedIn, 

isSignedIn,isAuthenticated, updateUser);


module.exports = router;