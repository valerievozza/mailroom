const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth') 
const homeController = require('../controllers/home')
const auth = require('../middleware/auth')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', homeController.getIndex)
router.get('/login', ensureGuest, authController.getLogin)
router.post('/login', authController.postLogin)
router.get('/logout', authController.logout)
router.get('/signup', authController.getSignup)
router.post('/signup', authController.postSignup)

// // Get Google Login page
// router.get('/google', authController.getGoogleLogin)

// // Google auth callback
// router.get('/google/callback', authController.googleCallback)

router.get('/dashboard', ensureAuth, authController.getDashboard)

module.exports = router