const express = require('express')
const logger = require('./util/logger')
const authRoutes = require('./module/auth/router')
const userRoutes = require('./module/users/router')
const groupRoutes = require('./module/groups/router')
const checkinRoutes = require('./module/checkins/router')
const errorHandler = require('./util/errorHandler')
const ApiError = require('./util/ApiError')
const app = express()
require('./util/passport')

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/groups', groupRoutes)
app.use('/checkins', checkinRoutes)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(ApiError.notFound())
})

// response handler api error
app.use(errorHandler)

module.exports = app
