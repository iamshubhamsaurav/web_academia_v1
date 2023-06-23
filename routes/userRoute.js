const express = require('express')
const { getUserProfile, getEditUserProfile } = require('../controllers/userController')


const { isLoggedIn, checkUserLoggedInStatus } = require('../middlewares/user')
const router = express.Router()

router.get('/:id',isLoggedIn, getUserProfile)
router.get('/:id/edit',isLoggedIn, getEditUserProfile)

module.exports = router