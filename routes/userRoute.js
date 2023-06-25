const express = require('express')
const { getPublicUserProfile} = require('../controllers/userController')

const router = express.Router()

router.get('/:id', getPublicUserProfile)

module.exports = router