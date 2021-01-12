const express = require('express')
const router = express.Router()
const controller = require('./controllers')
const passport = require('passport')

router.get('/', passport.authenticate('jwt', { session: false }), controller.get)

router.get('/:id', passport.authenticate('jwt', { session: false }), controller.find)

router.post('/', passport.authenticate('jwt', { session: false }), controller.insert)

router.put('/:id', passport.authenticate('jwt', { session: false }), controller.update)

router.delete('/:id', passport.authenticate('jwt', { session: false }), controller.delete)

module.exports = router
