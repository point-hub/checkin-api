const express = require('express')
const router = express.Router()
const controller = require('./controllers')
const passport = require('passport')

router.get('/', passport.authenticate('jwt', { session: false }), controller.get)

router.get('/:id', passport.authenticate('jwt', { session: false }), controller.find)

router.post('/', passport.authenticate('jwt', { session: false }), controller.insert)

router.put('/:id', passport.authenticate('jwt', { session: false }), controller.update)

router.put('/:id/suspend', passport.authenticate('jwt', { session: false }), controller.suspend)

router.put('/:id/unsuspend', passport.authenticate('jwt', { session: false }), controller.unsuspend)

router.put('/:id/inviteUser', passport.authenticate('jwt', { session: false }), controller.inviteUser)

router.put('/:id/acceptInvite', passport.authenticate('jwt', { session: false }), controller.acceptInvite)

router.put('/:id/declineInvite', passport.authenticate('jwt', { session: false }), controller.declineInvite)

router.put('/:id/addUser', passport.authenticate('jwt', { session: false }), controller.addUser)

router.put('/:id/removeUser', passport.authenticate('jwt', { session: false }), controller.removeUser)

router.delete('/:id', passport.authenticate('jwt', { session: false }), controller.delete)

module.exports = router
