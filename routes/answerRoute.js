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

router.post('/:id/edit',isLoggedIn, updateAnswer)    
router.get('/:id/delete',isLoggedIn, deleteAnswer)

module.exports = router