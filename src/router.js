const express = require('express')
const logger = require('./util/logger')
const authRoutes = require('./module/auth/router')
const userRoutes = require('./module/users/router')
const groupRoutes = require('./module/groups/router')
const checkinRoutes = require('./module/checkins/router')
const app = express()
require('./util/passport')

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/groups', groupRoutes)
app.use('/checkins', checkinRoutes)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

// response handler api error
app.use((error, req, res, next) => {
  logger.error({ message: error.message })
  res.status(error.status || 500)
  res.json({
    status: 'failed',
    error: {
      code: error.status,
      message: error.message
    }
  })
  next()
})

module.exports = app
