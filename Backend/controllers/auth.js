// Validation
const { validationResult } = require("express-validator");

// imports
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// user model
const User = require("../models/user");


exports.singup = (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error("Validation error");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req?.body?.email;
    const password = req?.body?.password;
    const name =  req?.body?.name;
    bcrypt.hash(password, 15)
    .then( hasedPassword =>{
        const user = new User({
            email: email,
            password: hasedPassword,
            name: name,
        });
        return user.save();
    })
    .then(
        result =>{
            res.status(201).json({
                message:'A new user is created!',
                userId: result?._id
            })
        }
    )
    .catch( error => next(error));
};

exports.login = (req, res, next) =>{
    const email = req?.body?.email;
    const password = req?.body?.password;
    let loadedUSer;
    User.findOne({ email: email })
    .then( user =>{
        if(!user){
            const error = new Error('User could not found with this email');
            error.statusCode = 401;
            throw error;
        }
        loadedUSer = user;
        return bcrypt.compare(password, user?.password);

    })
    .then( isMatch =>{
        if(!isMatch){
            const error = new Error('Incorrect email or password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            email:loadedUSer.email,
            name: loadedUSer?.name,
            userId: loadedUSer?._id
        },
        'secreetKey',
        { expiresIn: '1h'});
        res.status(200).json({
            token: token,
            userId: loadedUSer._id.toString(), 
        })
    })
    .catch( error => next(error));
};

exports.getStatus = (req, res, next) => {
    User.findOne(req?.userId)
    .then( user => {
        res.status(200).json({
            status: user?.status
        })
    })
    .catch( error => next(error));
};


exports.updateStatus = (req, res, next) => {
    const newStatus = req?.body?.status;
    User.findOne(req?.userId)
    .then( user => {
        user.status = newStatus;
        return user.save();
    })
    .then( user => {
        res.status(200).json({
            user: user
        });
    })
    .catch( error => next(error));
}
