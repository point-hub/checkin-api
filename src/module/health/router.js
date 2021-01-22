const express = require('express')
const router = express.Router()

router.get('/check', async (req, res, next) => {
  return res.status(200).send('ok')
})

module.exports = router
