const Article = require("../models/Article");
const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Question = require('../models/Question');
const Answer = require('../models/Answer');

exports.getUserProfile = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id)
    if(!user) {
        return next(new AppError('Resource not found', 404))
    }
    const articles = await Article.find({user: user._id})
    const questions = await Question.find({user: user._id})
    const answers = await Answer.find({user: user._id})

    console.log(questions);
    res.render('user/user_profile', {user, articles, questions, answers})
})