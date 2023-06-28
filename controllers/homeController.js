const catchAsync = require("../utils/catchAsync")
const Question = require('../models/Question')
const Article = require("../models/Article")
const { countTotalDocuments } = require("../utils/countTotalDocuments")


exports.getHome = catchAsync(async (req, res, next) => {
    const questions = await Question.find().populate({
        path: 'answers',
        select: 'text _id createdAt'
    }).populate({
        path: 'user',
        select: 'name _id profilePicture'
    })
    // questions.forEach(question => {
    //     console.log(new Date(question.answers.slice(-1)[0].createdAt).getHours())
    // });
    const recentArticles = await Article.find().sort({ createdAt: -1 }).limit(5).populate({
        path: 'user',
        select: 'name _id profilePicture'
    })
    const count = await countTotalDocuments()
    res.render('home/index', {questions, recentArticles, user: req.user, count})
})


exports.getAbout = catchAsync(async (req, res, next) => {
    res.render('home/about', { user: req.user})
})


exports.getContact = catchAsync(async (req, res, next) => {
    res.render('home/contact', { user: req.user})
})

exports.getFAQ = catchAsync(async (req, res, next) => {
    res.render('home/faq', { user: req.user})
})

exports.getPrivacyPolicy = catchAsync(async (req, res, next) => {
    res.render('home/privacy_policy', { user: req.user})
})

exports.getTermsAndConditions = catchAsync(async (req, res, next) => {
    res.render('home/terms_conditions', { user: req.user})
})
