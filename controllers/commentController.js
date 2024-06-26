const Comment = require('../models/Comment')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const { findRecentArticles } = require('../utils/findRecentArticles')
const { countTotalDocuments } = require('../utils/countTotalDocuments')

exports.createComment = catchAsync(async (req, res, next) => {
    req.body.user = req.user._id
    req.body.article = req.params.articleId
    const comment = await Comment.create(req.body)
    res.redirect(`/api/v1/articles/${comment.article}`)
})

exports.getUpdateComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.findById(req.params.id)
    if(!comment) {
        return next(new AppError('Comment not found', 404))
    }
    if(req.user._id.toString() !== comment.user.toString()) {
        return next(new AppError('You are not authorized', 404))
    }
    const recentArticles = await findRecentArticles()

    const count = await countTotalDocuments()
    res.render('articles/edit_comment', { comment, user: req.user, recentArticles, count })
})

exports.updateComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.findById(req.params.id)
    if(!comment) {
        return next(new AppError('Comment not found', 404))
    }
    if(req.user._id.toString() !== comment.user.toString()) {
        return next(new AppError('You are not authorized', 404))
    }
    await Comment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.redirect(`/api/v1/articles/${comment.article}`)
})

exports.deleteComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.findById(req.params.id).populate('user')
    if(!comment) {
        return next(new AppError('Comment not found', 404))
    }
    if(req.user._id.toString() !== comment.user._id.toString()) {
        return next(new AppError('You are not authorized', 404))
    }
    await Comment.findByIdAndDelete(req.params.id)
    res.redirect(`/api/v1/articles/${comment.article}`)
})