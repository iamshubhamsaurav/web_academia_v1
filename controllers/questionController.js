const Question = require('../models/Question')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Answer = require('../models/Answer')
const Article = require('../models/Article')
const { countTotalDocuments } = require('../utils/countTotalDocuments')
const { findRecentArticles } = require('../utils/findRecentArticles')
const cloudinary = require('cloudinary').v2

// @route       : GET /api/v1/questions
// @desc        : Get all Questions
// @access      : Public
exports.getAllQuestions = catchAsync(async (req, res, next) => {
    const questions = await Question.find().populate({
        path: 'answers',
        select: 'text _id'
    }).populate({
        path: 'user',
        select: 'name _id profilePicture'
    })

    res.status(200).json({
        success: true,
        count: questions.length,
        questions
    })
})

// @route       : GET /api/v1/questions/:id
// @desc        : Get Single Question
// @access      : Public
exports.getSingleQuestion = catchAsync(async (req, res, next) => {
    const question = await Question.findById(req.params.id).populate({
        path: 'user',
        select: 'name _id profilePicture'
    })

    if(!question) {
        return next(new AppError(`Question with the id: ${req.params.id} not found.`, 404))
    }

    const answers = await Answer.find({question: question._id}).populate({
        path: 'user',
        select: 'name _id profilePicture'
    })
    question.answers = answers

    const recentArticles = await findRecentArticles()

    const count = await countTotalDocuments()
    res.render('questions/question_details', {question, recentArticles, user: req.user, count})
})

exports.getCreateQuestion = catchAsync(async (req, res, next) => {
    const recentArticles = await findRecentArticles()

    const count = await countTotalDocuments()
    res.render('questions/add_question', {recentArticles, user: req.user, count})
})

// @route       : POST /api/v1/questions
// @desc        : Create Question
// @access      : Private
exports.createQuestion = catchAsync(async (req, res, next) => {
    // uploading the image
    if(req.files != null) {
        let file = req.files.coverImage
        if(file) {
            let res = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "web_academia/questions"
            })
            req.body.coverImage = {
                public_id: res.public_id,
                secure_url: res.secure_url
            }
            
        }
    }
    req.body.user = req.user._id
    
    const question = await Question.create(req.body)
    // res.status(200).json({
    //     success: true,
    //     question
    // })
    res.redirect('/api/v1/')
})

exports.getEditQuestion = catchAsync(async (req, res, next) => {
    const question = await Question.findById(req.params.id)

    if(!question) {
        return next(new AppError(`Question with the id: ${req.params.id} not found.`, 404))
    }
    const recentArticles = await findRecentArticles()

    const count = await countTotalDocuments()
    res.render('questions/edit_question', {question, recentArticles, user: req.user, count})
})

// @route       : PATCH /api/v1/questions/:id
// @desc        : Update Question
// @access      : Private
exports.updateQuestion = catchAsync(async (req, res, next) => {
    const question = await Question.findById(req.params.id)

    if(req.user._id.toString() !== question.user.toString()) {
        return next(new AppError('You are not authorized to perform this action', 400))
    }

    if(!question) {
        return next(new AppError(`Question with the id: ${req.params.id} not found.`, 404))
    }

    if(req.files != null) {
        let file = req.files.coverImage
        
        // first delete the existing image
        let imageId = question.coverImage.public_id
        if(imageId && imageId !== '') {
            await cloudinary.uploader.destroy(imageId)
        }
        
        const res = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "web_academia/questions"
        })
        req.body.coverImage = {
            public_id: res.public_id,
            secure_url: res.secure_url
        }
    }

    const updatedQuestion = await Question.findByIdAndUpdate(question._id, req.body, {
        new: true,
        runValidators: true
    })
    
    // res.status(200).json({
    //     success: true,
    //     question: updatedQuestion
    // })
    res.redirect(`/api/v1/questions/${question._id}`)
})



// @route       : DELETE /api/v1/questions/:id
// @desc        : Delete Question
// @access      : Private
exports.deleteQuestion = catchAsync(async (req, res, next) => {
    const question = await Question.findById(req.params.id)

    if(req.user._id.toString() !== question.user.toString()) {
        return next(new AppError('You are not authorized to perform this action', 400))
    }

    if(!question) {
        return next(new AppError(`Question with the id: ${req.params.id} not found.`, 404))
    }

    // find answers and delete all their cover images before deleing the answers
    const answers = await Answer.find({question: question._id})

    for (let index = 0; index < answers.length; index++) {
        const imageId = answers[index].coverImage.public_id
        if(imageId && imageId !== '') {
            await cloudinary.uploader.destroy(imageId)
        }
    }

    // Deleting the answers before deleting the question
    await Answer.deleteMany({question: question._id})

    // deleting the coverImage of question before deleting the question
    const imageId = question.coverImage.public_id
    if(imageId && imageId !== '') {
        await cloudinary.uploader.destroy(imageId)
    }

    // console.log('FOUND' + question)
    await Question.deleteOne({_id: question._id})
    // res.status(200).json({
    //     success: true,
    //     message: 'Question and all the answers belonging to this question has been deleted.'
    // })
    res.redirect('/api/v1/')
})

