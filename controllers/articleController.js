const Article = require('../models/Article')
const Comment = require('../models/Comment')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const { countTotalDocuments } = require('../utils/countTotalDocuments')
const { findRecentArticles } = require('../utils/findRecentArticles')
const cloudinary = require('cloudinary').v2

// @route       : GET /api/v1/articles
// @desc        : Get all Articles
// @access      : Public
exports.getAllArticles = catchAsync(async (req, res, next) => {
    const articles = await Article.find().sort({ createdAt: -1 }).populate({
        path: 'user',
        select: 'name _id profilePicture'
    })

    // res.status(200).json({
    //     success: true,
    //     count: articles.length,
    //     articles
    // })

    res.render('articles/articles', {articles, user: req.user})
})


// @route       : GET /api/v1/articles/:id
// @desc        : Get Single article
// @access      : Public
exports.getSingleArticle = catchAsync(async (req, res, next) => {
    const article = await Article.findById(req.params.id).populate({
        path: 'user',
        select: 'name _id profilePicture'
    })


    if(!article) {
        return next(new AppError(`Article with the id: ${req.params.id} not found.`, 404))
    }

    const comments = await Comment.find({article: article._id}).populate({
        path: 'user',
        select: 'name _id profilePicture'
    })

    article.comments = comments
    // console.log(comments)

    const recentArticles = await findRecentArticles()

    const count = await countTotalDocuments()
    
    res.render('articles/articles_details', {article, recentArticles, user: req.user, count})
})

// @route       : GET /api/v1/articles/add
// @desc        : Get Show Create Article Form
// @access      : Private
exports.getCreateArticle = catchAsync(async (req, res, next) => {
    const recentArticles = await findRecentArticles()

    const count = await countTotalDocuments()
    
    res.render('articles/publish_article', {recentArticles, user: req.user, count})
})

// @route       : POST /api/v1/articles
// @desc        : Create Article
// @access      : Private
exports.createArticle = catchAsync(async (req, res, next) => {
    // uploading the image
    if(req.files != null) {
        let file = req.files.coverImage
        if(file) {
            let res = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "web_academia/articles"
            })
            req.body.coverImage = {
                public_id: res.public_id,
                secure_url: res.secure_url
            }
            
        }
    }

    // Setting the user to the new article being created
    req.body.user = req.user._id
    
    const article = await Article.create(req.body)
    res.redirect('/api/v1/articles');
    // console.log(article)
    // res.status(200).json({
    //     success: true,
    //     article
    // })
})

// @route       : GET /api/v1/articles/:id/edit
// @desc        : Get Edit Article Form
// @access      : Private
exports.getEditArticle = catchAsync(async (req, res, next) => {
    const recentArticles = await findRecentArticles()

    const article = await Article.findById(req.params.id)
    const count = await countTotalDocuments()
    res.render('articles/edit_article', {article, recentArticles, user: req.user, count})
})

// @route       : PATCH /api/v1/articles/:id
// @desc        : Update Article
// @access      : Private
exports.updateArticle = catchAsync(async (req, res, next) => {

    const article = await Article.findById(req.params.id)

    if(req.user._id.toString() !== article.user.toString()) {
        return next(new AppError('You are not authorized to perform this action', 400))
    }

    if(!article) {
        return next(new AppError(`Article with the id: ${req.params.id} not found.`, 404))
    }

    if(req.files != null) {
        let file = req.files.coverImage
        
        // first delete the existing image
        let imageId = article.coverImage.public_id
        if(imageId && imageId !== '') {
            await cloudinary.uploader.destroy(imageId)
        }
        
        const res = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "web_academia/articles"
        })
        req.body.coverImage = {
            public_id: res.public_id,
            secure_url: res.secure_url
        }
    }

    // req.body.coverImage = article.coverImage

    const updatedArticle = await Article.findByIdAndUpdate(article._id, req.body, {
        new: true,
        runValidators: true
    })
    
    res.redirect(`/api/v1/articles/${updatedArticle._id}`)
})



// @route       : DELETE /api/v1/articles/:id
// @desc        : Delete Article
// @access      : Private
exports.deleteArticle = catchAsync(async (req, res, next) => {
    const article = await Article.findById(req.params.id)

    if(req.user._id.toString() !== article.user.toString()) {
        return next(new AppError('You are not authorized to perform this action', 400))
    }

    if(!article) {
        return next(new AppError(`Article with the id: ${req.params.id} not found.`, 404))
    }
    
    // Deleting the coverImage before article
    const imageId = article.coverImage.public_id
    if(imageId && imageId !== '') await cloudinary.uploader.destroy(imageId)
    await Article.findByIdAndDelete(article._id)

    // res.status(200).json({
    //     success: true,
    //     message: 'Article has been deleted.'
    // })
    res.status(200).redirect('/api/v1/articles/')
})

