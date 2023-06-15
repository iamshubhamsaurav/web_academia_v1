const catchAsync = require("../utils/catchAsync")
const Question = require('../models/Question')
const Article = require("../models/Article")


exports.getHome = catchAsync(async (req, res, next) => {
    const questions = await Question.find().populate({
        path: 'answers',
        select: 'text _id createdAt'
    })
    // questions.forEach(question => {
    //     console.log(new Date(question.answers.slice(-1)[0].createdAt).getHours())
    // });
    const recentArticles = await Article.find().sort({ createdAt: -1 }).limit(5)
    res.render('home/index', {questions, recentArticles})
})


exports.getAbout = catchAsync(async (req, res, next) => {
    res.render('home/about')
})


exports.getContact = catchAsync(async (req, res, next) => {
    res.render('home/contact')
})

exports.getFAQ = catchAsync(async (req, res, next) => {
    res.render('home/faq')
})

exports.getPrivacyPolicy = catchAsync(async (req, res, next) => {
    res.render('home/privacy_policy')
})

exports.getTermsAndConditions = catchAsync(async (req, res, next) => {
    res.render('home/terms_conditions')
})
