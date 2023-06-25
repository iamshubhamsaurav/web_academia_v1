const express = require('express')
const { login, signup, logout, getLogin, getSignup, changePassword, updateProfile, getUserProfile } = require('../controllers/authController')
const { isLoggedIn } = require('../middlewares/user')
const { getPublicUserProfile } = require('../controllers/userController')

const router = express.Router()


router.get('/login', getLogin)
router.post('/login', login)

router.get('/signup', getSignup)
router.post('/signup', signup)

router.post('/changePassword',isLoggedIn, changePassword)
router.post('/updateProfile',isLoggedIn, updateProfile)

router.get('/logout', logout)

router.get('/:id',isLoggedIn, getUserProfile)
router.get('/:id/edit',isLoggedIn, getPublicUserProfile)

module.exports = router