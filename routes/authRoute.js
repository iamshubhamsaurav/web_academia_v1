const express = require('express')
const { login, signup, logout, getLogin, getSignup } = require('../controllers/authController')

const router = express.Router()


router.get('/login', getLogin)
router.post('/login', login)

router.get('/signup', getSignup)
router.post('/signup', signup)

router.get('/logout', logout)

module.exports = router