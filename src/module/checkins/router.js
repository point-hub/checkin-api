const express = require('express')
const router = express.Router()
const controller = require('./controllers')
const who = require('../../util/who')
const auth = require('../../middleware/auth')

router.get('/', auth, controller.get)

router.get('/:id', auth, who, controller.find)

router.post('/', auth, who, controller.insert)

router.put('/:id', auth, who, controller.update)

router.delete('/:id', auth, who, controller.delete)

module.exports = router
