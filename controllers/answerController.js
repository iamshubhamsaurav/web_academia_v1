const Answer = require('../models/Answer')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Question = require('../models/Question')
const cloudinary = require('cloudinary').v2

// @route       : GET /api/v1/answers
// @route       : GET /api/v1/questions/questionId/
// @desc        : Get all Answers
// @access      : Public
exports.getAllAnswers = catchAsync(async (req, res, next) => {

    if(req.params.questionId) {
        const question = await Question.findById(req.params.questionId)
        if(!question) {
            return next(new AppError(`Question not found with the id: ${req.params.questionId}`, 404))
        }
        const answers = await Answer.find({question: req.params.questionId})

        return res.status(200).json({
            success: true,
            question,
            count: answers.length,
            answers
        })
    }

    // if the questionId is not present then return all answers
    const answers = await Answer.find()

    res.status(200).json({
        success: true,
        count: answers.length,
        answers
    })
})

// @route       : GET /api/v1/answers/:id
// @desc        : Get Single Answer
// @access      : Public
exports.getSingleAnswer = catchAsync(async (req, res, next) => {
    const answer = await Answer.findById(req.params.id).populate('question')

    if(!answer) {
        return next(new AppError(`Answer with the id: ${req.params.id} not found.`, 404))
    }

    res.status(200).json({
        success: true,
        answer
    })
})

// @route       : POST /api/v1/questions/:questionId/
// @desc        : Create Answer
// @access      : Private
exports.createAnswer = catchAsync(async (req, res, next) => {
    req.body.question = req.params.questionId

        // uploading the image
        if(req.files.coverImage) {
            let file = req.files.coverImage
            if(file) {
                let res = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: "web_academia/answers"
                })
                req.body.coverImage = {
                    public_id: res.public_id,
                    secure_url: res.secure_url
                }
                
            }
        }

    const answer = await Answer.create(req.body)
    res.status(200).json({
        success: true,
        answer
    })
})

// @route       : PATCH /api/v1/answers/:id
// @desc        : Update Answer
// @access      : Private
exports.updateAnswer = catchAsync(async (req, res, next) => {
    const answer = await Answer.findById(req.params.id)

    if(!answer) {
        return next(new AppError(`Answer with the id: ${req.params.id} not found.`, 404))
    }

    if(req.files.coverImage) {
        let file = req.files.coverImage
        
        // first delete the existing image
        let imageId = answer.coverImage.public_id
        if(imageId && imageId !== '') {
            await cloudinary.uploader.destroy(imageId)
        }
        //upload the new image
        const res = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "web_academia/answers"
        })
        req.body.coverImage = {
            public_id: res.public_id,
            secure_url: res.secure_url
        }
    }

    const updatedAnswer = await Answer.findByIdAndUpdate(answer._id, req.body, {
        new: true,
        runValidators: true
    })
    
    res.status(200).json({
        success: true,
        answer: updatedAnswer
    })
})


// @route       : DELETE /api/v1/answers/:id
// @desc        : Delete Answer
// @access      : Private
exports.deleteAnswer = catchAsync(async (req, res, next) => {
    const answer = await Answer.findById(req.params.id)

    if(!answer) {
        return next(new AppError(`Answer with the id: ${req.params.id} not found.`, 404))
    }

    // deleting the coverImage of answer before deleting the answer
    const imageId = answer.coverImage.public_id
    if(imageId && imageId !== '') {
        await cloudinary.uploader.destroy(imageId)
    }

    await Answer.findByIdAndDelete(answer._id)

    res.status(200).json({
        success: true,
        message: 'Answer has been deleted.'
    })
})

