const Article = require('../models/Article')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const cloudinary = require('cloudinary').v2

// @route       : GET /api/v1/articles
// @desc        : Get all Articles
// @access      : Public
exports.getAllArticles = catchAsync(async (req, res, next) => {
    const articles = await Article.find().sort({ createdAt: -1 })

    // res.status(200).json({
    //     success: true,
    //     count: articles.length,
    //     articles
    // })

    res.render('articles', {articles})
})


// @route       : GET /api/v1/articles/:id
// @desc        : Get Single article
// @access      : Public
exports.getSingleArticle = catchAsync(async (req, res, next) => {
    const article = await Article.findById(req.params.id)

    if(!article) {
        return next(new AppError(`Article with the id: ${req.params.id} not found.`, 404))
    }

    const recentArticles = await Article.find().sort({ createdAt: -1 }).limit(5)
    

    res.render('articles_details', {article, recentArticles})
})

// @route       : GET /api/v1/articles/add
// @desc        : Get Show Create Article Form
// @access      : Private
exports.getCreateArticle = catchAsync(async (req, res, next) => {
    const recentArticles = await Article.find().sort({ createdAt: -1 }).limit(5)
    
    res.render('publish_article', {recentArticles})
})

// @route       : POST /api/v1/articles
// @desc        : Create Article
// @access      : Private
exports.createArticle = catchAsync(async (req, res, next) => {

    console.log(req.body)
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
    const recentArticles = await Article.find().sort({ createdAt: -1 }).limit(5)
    const article = await Article.findById(req.params.id)
    res.render('edit_article', {article, recentArticles})
})

// @route       : PATCH /api/v1/articles/:id
// @desc        : Update Article
// @access      : Private
exports.updateArticle = catchAsync(async (req, res, next) => {

    const article = await Article.findById(req.params.id)

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

