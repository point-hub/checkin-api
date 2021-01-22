const express = require('express')
const router = express.Router()
const controller = require('./controllers')
const passport = require('passport')

router.post('/login', passport.authenticate('local', { session: false, failWithError: true }), controller.login)

router.post('/register', controller.register)

// test jwt
router.get('/secret', passport.authenticate('jwt', { session: false, failWithError: true }), controller.secret)

router.get('/verify-email', controller.verifyEmail)

module.exports = router
