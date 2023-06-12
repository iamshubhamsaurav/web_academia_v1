const express = require('express')

const router = express.Router()

const answerRouter = require('./answerRoute')

const {
    getAllQuestions,
    getSingleQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion
} = require('../controllers/questionController')

// Routing to Answer
router.use('/:questionId/answers', answerRouter)

router.route('/')
    .get(getAllQuestions)
    .post(createQuestion)

router.route('/:id')
    .get(getSingleQuestion)
    .patch(updateQuestion)
    .delete(deleteQuestion)

module.exports = router