const express = require('express')
const router = express.Router()
const controller = require('./controllers')
const passport = require('passport')

router.get('/', passport.authenticate('jwt', { session: false }), controller.get)

router.get('/:id', passport.authenticate('jwt', { session: false }), controller.find)

router.put('/:id', passport.authenticate('jwt', { session: false }), controller.update)

module.exports = router
