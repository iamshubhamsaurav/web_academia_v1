const express = require('express')

const { 
    getAllAnswers,
    createAnswer,
    getSingleAnswer, 
    updateAnswer, 
    deleteAnswer 
} = require('../controllers/answerController')

const router = express.Router({mergeParams: true})

router.route('/')
    .get(getAllAnswers)
    .post(createAnswer)

router.route('/:id')
    .get(getSingleAnswer)
    .patch(updateAnswer)
    .delete(deleteAnswer)

module.exports = router