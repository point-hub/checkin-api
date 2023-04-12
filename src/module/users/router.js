const express = require('express')
const router = express.Router()
const controller = require('./controllers')
const auth = require('../../middleware/auth')
const who = require('../../util/who')

router.get('/', auth, who, controller.get)

router.get('/:id', auth, who, controller.find)

router.put('/:id', auth, who, controller.update)

module.exports = router
