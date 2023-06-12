const express = require('express')
const { getHome, getAbout } = require('../controllers/homeController')

const router = express.Router()

router.get('/', getHome)
router.get('/about', getAbout)
router.get('/contact', getAbout)

module.exports = router