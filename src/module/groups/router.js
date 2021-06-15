const express = require('express')
const router = express.Router()
const controller = require('./controllers')
const passport = require('passport')
const who = require('../../util/who')

router.get('/', passport.authenticate('jwt', { session: false }), who, controller.get)

router.get('/:id', passport.authenticate('jwt', { session: false }), who, controller.find)

router.post('/', passport.authenticate('jwt', { session: false }), who, controller.insert)

router.put('/:id', passport.authenticate('jwt', { session: false }), who, controller.update)

router.put('/:id/suspend', passport.authenticate('jwt', { session: false }), who, controller.suspend)

router.put('/:id/unsuspend', passport.authenticate('jwt', { session: false }), who, controller.unsuspend)

router.put('/:id/inviteUser', passport.authenticate('jwt', { session: false }), who, controller.inviteUser)

router.put('/:id/acceptInvite', passport.authenticate('jwt', { session: false }), who, controller.acceptInvite)

router.put('/:id/declineInvite', passport.authenticate('jwt', { session: false }), who, controller.declineInvite)

router.put('/:id/addUser', passport.authenticate('jwt', { session: false }), who, controller.addUser)

router.put('/:id/removeUser', passport.authenticate('jwt', { session: false }), who, controller.removeUser)

router.delete('/:id', passport.authenticate('jwt', { session: false }), who, controller.delete)

module.exports = router
