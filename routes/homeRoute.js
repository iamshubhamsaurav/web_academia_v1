const express = require('express')
const { getHome, getAbout, getContact } = require('../controllers/homeController')

const router = express.Router()

router.get('/', getHome)
router.get('/about', getAbout)
router.get('/contact', getContact)

module.exports = router