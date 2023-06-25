const express = require('express')
const { getHome, getAbout, getContact, getFAQ, getTermsAndConditions, getPrivacyPolicy } = require('../controllers/homeController')
const { checkUserLoggedInStatus } = require('../middlewares/user')

const router = express.Router()

router.get('/',checkUserLoggedInStatus, getHome)
router.get('/about',checkUserLoggedInStatus, getAbout)
router.get('/contact',checkUserLoggedInStatus, getContact)
router.get('/faq',checkUserLoggedInStatus, getFAQ)
router.get('/termsandconditions',checkUserLoggedInStatus, getTermsAndConditions)
router.get('/privacypolicy',checkUserLoggedInStatus, getPrivacyPolicy)

module.exports = router