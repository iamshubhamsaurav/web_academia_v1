const express = require('express')
const { checkUserLoggedInStatus, isLoggedIn } = require('../middlewares/user')

const router = express.Router()

const answerRouter = require('./answerRoute')

const {
    getAllQuestions,
    getSingleQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getCreateQuestion,
    getEditQuestion
} = require('../controllers/questionController')

// Routing to Answer
router.use('/:questionId/answers', answerRouter)


// Create Question
router.post('/',isLoggedIn, createQuestion)
router.get('/add',isLoggedIn, getCreateQuestion)

// Get Question
router.get('/',checkUserLoggedInStatus, getAllQuestions)
router.get('/:id',checkUserLoggedInStatus, getSingleQuestion)

// Edit
router.get('/:id/edit',isLoggedIn, getEditQuestion)
router.post('/:id/edit',isLoggedIn, updateQuestion)

// Delete 
router.get('/:id/delete',isLoggedIn, deleteQuestion)

module.exports = router