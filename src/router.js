const express = require('express')
const logger = require('./util/logger')
const authRoutes = require('./module/auth/router')
const userRoutes = require('./module/users/router')
const checkinRoutes = require('./module/checkins/router')
const app = express()
const datalize = require('datalize')

datalize.set('autoValidate', true)

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/checkins', checkinRoutes)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

// response handler api error
app.use((error, req, res, next) => {
  if (error instanceof datalize.Error) {
    const err = Object.assign({
      code: 422,
      message: 'invalid data'
    }, error.toJSON())
    res.status(422).send(Object.assign({
      status: 'failed',
      error: err
    }))
  } else {
    logger.error({ message: error.message })
    res.status(error.status || 500)
    res.json({
      status: 'failed',
      error: {
        code: error.status,
        message: error.message
      }
    })
  }
  next()
})

module.exports = app
