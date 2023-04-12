const express = require('express')
const router = express.Router()
const controller = require('./controllers')
const auth = require('../../middleware/auth')

router.post('/login', controller.login)

router.post('/register', controller.register)

// test jwt
router.get('/secret', auth, controller.secret)

router.get('/verify-email', controller.verifyEmail)

module.exports = router
