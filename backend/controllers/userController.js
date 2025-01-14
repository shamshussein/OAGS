const user = require("../models/userModel");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const { promisify } = require("util");

const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expriesIn: process.env.JWT_EXPIRE_IN
    });
};
const createSendToken = (user, statusCode, res) =>{
const token = signToken(user._id);
res.status(statusCode).json ({
    status: "success",
     token,
      data:{user}
    })
}
exports.signup = async (req, res) => {
    try {
        const emailCheck = await User.findOne({email:req.body.email});
        if(emailCheck){
            return res.status(400).json({message: 'Email is already in use'});
        }
        if(!validator.isEmail(req.body.email)){
            return res.status(400).json({message: 'Email is not valid'});
        }
        if(req.body.password !== req.body.passwordConfirm){
            return res.status(400).json({message: 'Password dont match'});
        }
        const newUser = await user.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role
        });
        createSendToken(newUser, 201, res)
    } catch (err) {
        res.status(500).json({message: err.message});
        console.log(err);
    }
};
exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user){
            res.status(404).json({message: 'user not found'});
        }
        if(!(await user.checkPassword(password, user.password))){
            res.status(401).json({message: 'incorrect email or password'});

        }
        createSendToken(user, 200, res);
    } catch (err) {
        res.status(500).json({message: err.message});
        console.log(err);
    }
};

exports.protect = async (req, res, next) => {
    try {
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
      }
      if (!token) {
        return res.status(401).json({ message: "You are not logged in" });
      }
  
      let decoded;
      try {
        decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      } catch (err) {
        if (err.name === "JsonWebTokenError") {
          return res.status(401).json({ message: "Invalid token" });
        } else if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Your session token is expired. Login again" });
        }
        console.log(err);
      }
  
      const currentUser = await user.findById(decoded.id); 
      if (!currentUser) {
        return res.status(401).json({ message: "The token owner no longer exists" });
      }
      if (currentUser.passwordChangedAfterTokenIssue(decoded.iat)) {
        return res.status(401).json({ message: "Your password has been changed. Please log in again" });
      }
      req.user = currentUser;
      next();
    } catch (err) {
      console.log(err);
    }
  };
  
