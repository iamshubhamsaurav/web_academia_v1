const express = require('express')
const { login, signup, logout, getLogin, getSignup, changePassword, updateProfile } = require('../controllers/authController')
const { isLoggedIn } = require('../middlewares/user')

const router = express.Router()


router.get('/login', getLogin)
router.post('/login', login)

router.get('/signup', getSignup)
router.post('/signup', signup)

router.post('/changePassword',isLoggedIn, changePassword)
router.post('/updateProfile',isLoggedIn, updateProfile)

router.get('/logout', logout)

module.exports = router