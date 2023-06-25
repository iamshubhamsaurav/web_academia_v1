const express = require('express')

const { 
    getAllAnswers,
    createAnswer,
    getSingleAnswer, 
    updateAnswer, 
    deleteAnswer 
} = require('../controllers/answerController')
const { checkUserLoggedInStatus, isLoggedIn } = require('../middlewares/user')

const router = express.Router({mergeParams: true})

router.route('/')
    .get(checkUserLoggedInStatus, getAllAnswers)
    .post(isLoggedIn, createAnswer)

router.route('/:id')
    .get(checkUserLoggedInStatus, getSingleAnswer)
    .patch(isLoggedIn, updateAnswer)
    .delete(isLoggedIn, deleteAnswer)

module.exports = router