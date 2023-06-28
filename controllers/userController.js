const Article = require("../models/Article");
const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Question = require('../models/Question');
const Answer = require('../models/Answer');



exports.getPublicUserProfile = catchAsync(async (req, res, next) => {
    const fetchedUser = await User.findById(req.params.id)
    if(!fetchedUser) {
        return next(new AppError('Please provide correct user id', 404))
    }
    const articles = await Article.find({user: fetchedUser._id})
    const questions = await Question.find({user: fetchedUser._id})
    const answers = await Answer.find({user: fetchedUser._id}).populate('question')

    res.render('user/public_user_profile', {fetchedUser, articles, questions, answers, user: req.user})
})