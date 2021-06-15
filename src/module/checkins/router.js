const express = require('express')
const router = express.Router()
const controller = require('./controllers')
const passport = require('passport')
const who = require('../../util/who')

router.get('/', passport.authenticate('jwt', { session: false }), who, controller.get)

router.get('/:id', passport.authenticate('jwt', { session: false }), who, controller.find)

router.post('/', passport.authenticate('jwt', { session: false }), who, controller.insert)

router.put('/:id', passport.authenticate('jwt', { session: false }), who, controller.update)

router.delete('/:id', passport.authenticate('jwt', { session: false }), who, controller.delete)

module.exports = router
