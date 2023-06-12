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

const router = express.Router()

router.route('/')
    .get(getAllArticles)
    .post(createArticle)

router.get('/add', getCreateArticle)
router.get('/:id/edit', getEditArticle)
router.post('/:id/edit', updateArticle)
router.get('/:id/delete', deleteArticle)

router.route('/:id')
    .get(getSingleArticle)
    

module.exports = router