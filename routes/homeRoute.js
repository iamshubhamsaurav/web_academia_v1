const express = require('express')
const { getHome, getAbout, getContact, getFAQ, getTermsAndConditions, getPrivacyPolicy } = require('../controllers/homeController')

const router = express.Router()

router.get('/', getHome)
router.get('/about', getAbout)
router.get('/contact', getContact)
router.get('/faq', getFAQ)
router.get('/termsandconditions', getTermsAndConditions)
router.get('/privacypolicy', getPrivacyPolicy)

module.exports = router