const express = require("express");
const router = express.Router();

// Validator
const { body } = require("express-validator"); 

// Model
const User = require("../models/user");

// Controller
const authController = require("../controllers/auth");

router.put("/signup", [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, {req}) =>{
        return User.findOne({email:value}).then(
            userdoc => {
                if(userdoc){
                    return Promise.reject("User already exists !");
                }
            }
        )
    })
    .normalizeEmail(),
    body("password").trim().isLength({min:3}),
    ],
    authController.singup);

router.post("/login", authController.login);

router.get("/status", authController.getStatus);

router.put("/status", authController.updateStatus);


module.exports = router;