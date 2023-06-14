const express = require('express')

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
router.post('/', createQuestion)
router.get('/add', getCreateQuestion)

// Get Question
router.get('/', getAllQuestions)
router.get('/:id', getSingleQuestion)

// Edit
router.get('/:id/edit', getEditQuestion)
router.post('/:id/edit', updateQuestion)

// Delete 
router.get('/:id/delete', deleteQuestion)

module.exports = router