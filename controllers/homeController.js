const catchAsync = require("../utils/catchAsync")
const Question = require('../models/Question')

exports.getHome = catchAsync(async (req, res, next) => {
    const questions = await Question.find().populate({
        path: 'answers',
        select: 'text _id createdAt'
    })
    // questions.forEach(question => {
    //     console.log(new Date(question.answers.slice(-1)[0].createdAt).getHours())
    // });
    res.render('home/index', {questions})
})


exports.getAbout = catchAsync(async (req, res, next) => {
    res.render('home/about')
})


exports.getContact = catchAsync(async (req, res, next) => {
    res.render('home/contact')
})

