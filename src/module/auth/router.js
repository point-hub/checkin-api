const express = require('express')
const router = express.Router()
const controller = require('./controllers')
const passport = require('passport')
const datalize = require('datalize')
const field = datalize.field

router.post('/login', passport.authenticate('local', { session: false, failWithError: true }),
  function (req, res, next) {
    next()
  },
  function (err, req, res, next) {
    return res.status(401).send({
      error: {
        message: err.message
      }
    })
  }, controller.login)

router.post('/register', datalize([
  field('email').required().email(),
  field('username').required(),
  field('password').required()
]), controller.register)

// test jwt
router.get('/secret', passport.authenticate('jwt', { session: false }), controller.secret)

router.get('/verify-email', controller.verifyEmail)

module.exports = router
