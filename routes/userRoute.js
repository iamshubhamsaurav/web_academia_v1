const express = require('express')
const { getUserProfile } = require('../controllers/userController')


const { isLoggedIn, checkUserLoggedInStatus } = require('../middlewares/user')
const router = express.Router()

router.get('/:id',isLoggedIn, getUserProfile)

module.exports = router