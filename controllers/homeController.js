const catchAsync = require("../utils/catchAsync");

exports.getHome = catchAsync(async (req, res, next) => {
    res.render('home/index')
})


exports.getAbout = catchAsync(async (req, res, next) => {
    res.render('home/about')
})


exports.getContact = catchAsync(async (req, res, next) => {
    res.render('home/contact')
})

