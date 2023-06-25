const Article = require("../models/Article");
const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Question = require('../models/Question');
const Answer = require('../models/Answer');



exports.getPublicUserProfile = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if(!user) {
        return next(new AppError('Please provide correct user id', 404))
    }
    const articles = await Article.find({user: user._id})
    const questions = await Question.find({user: user._id})
    const answers = await Answer.find({user: user._id}).populate('question')

    res.render('user/public_user_profile', {user, articles, questions, answers})
})