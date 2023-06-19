const User = require('../models/User')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const jwt = require('jsonwebtoken')


exports.checkUserLoggedInStatus = catchAsync(async (req, res, next) => {
    let token = req.cookies.token;
  
    if(token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
    }
    next()
})

exports.isLoggedIn = catchAsync(async (req, res, next) => {
    // const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "");

    // check token first in cookies
    let token = req.cookies.token;
    
  
    // if token not found in cookies, check if header contains Auth field
    if (!token && req.header("Authorization")) {
      token = req.header("Authorization").replace("Bearer ", "");
    }
  
    if (!token) {
      return next(new AppError("Login first to access this page", 401));
    }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    req.user = await User.findById(decoded.id);
  
    next();
  });
  
  exports.customRole = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(new AppError("You are not allowed for this resouce", 403));
      }
      console.log(req.user.role);
      next();
    };
  };