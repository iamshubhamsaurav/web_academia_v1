const express = require('express')
const { getPublicUserProfile} = require('../controllers/userController')
const { checkUserLoggedInStatus } = require('../middlewares/user')

const router = express.Router()

router.get('/:id',checkUserLoggedInStatus, getPublicUserProfile)

module.exports = router