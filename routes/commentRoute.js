const express = require('express')

const {
    updateComment,
    deleteComment,
    createComment
} = require('../controllers/commentController.js')
const { isLoggedIn } = require('../middlewares/user')

const router = express.Router({mergeParams: true})

router.post('/', isLoggedIn, createComment)
router.post('/:id/edit',isLoggedIn, updateComment)    
router.get('/:id/delete',isLoggedIn, deleteComment)

module.exports = router