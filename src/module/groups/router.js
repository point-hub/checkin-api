const express = require('express')
const router = express.Router()
const controller = require('./controllers')
const auth = require('../../middleware/auth')
const who = require('../../util/who')

router.get('/', auth, who, controller.get)

router.get('/:id', auth, who, controller.find)

router.post('/', auth, who, controller.insert)

router.put('/:id', auth, who, controller.update)

router.put('/:id/suspend', auth, who, controller.suspend)

router.put('/:id/unsuspend', auth, who, controller.unsuspend)

router.put('/:id/inviteUser', auth, who, controller.inviteUser)

router.put('/:id/acceptInvite', auth, who, controller.acceptInvite)

router.put('/:id/declineInvite', auth, who, controller.declineInvite)

router.put('/:id/addUser', auth, who, controller.addUser)

router.put('/:id/removeUser', auth, who, controller.removeUser)

router.delete('/:id', auth, who, controller.delete)

module.exports = router
