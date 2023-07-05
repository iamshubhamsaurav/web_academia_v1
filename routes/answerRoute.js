const express = require('express')

const { 
    getAllAnswers,
    createAnswer,
    getSingleAnswer, 
    updateAnswer, 
    deleteAnswer, 
    getUpdateAnswer
} = require('../controllers/answerController')
const { checkUserLoggedInStatus, isLoggedIn } = require('../middlewares/user')

const router = express.Router({mergeParams: true})

router.route('/')
    .get(checkUserLoggedInStatus, getAllAnswers)
    .post(isLoggedIn, createAnswer)

router.route('/:id')
    .get(checkUserLoggedInStatus, getSingleAnswer)

router.get('/:id/edit',isLoggedIn, getUpdateAnswer)
router.post('/:id/edit',isLoggedIn, updateAnswer)
router.get('/:id/delete',isLoggedIn, deleteAnswer)

module.exports = router