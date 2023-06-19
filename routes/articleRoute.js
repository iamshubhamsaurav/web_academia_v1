const express = require('express')

const { 
    getAllArticles,
    createArticle, 
    getSingleArticle, 
    updateArticle, 
    deleteArticle,
    getCreateArticle,
    getEditArticle
} = require('../controllers/articleController')
const { isLoggedIn, checkUserLoggedInStatus } = require('../middlewares/user')

const router = express.Router()

router.route('/')
    .get(checkUserLoggedInStatus, getAllArticles)
    .post(isLoggedIn, createArticle)

router.get('/add', isLoggedIn, getCreateArticle)
router.get('/:id/edit', isLoggedIn, getEditArticle)
router.post('/:id/edit',isLoggedIn, updateArticle)
router.get('/:id/delete',isLoggedIn, deleteArticle)

router.route('/:id')
    .get(checkUserLoggedInStatus, getSingleArticle)
    

module.exports = router