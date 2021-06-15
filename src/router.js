const express = require('express')
const authRoutes = require('./module/auth/router')
const userRoutes = require('./module/users/router')
const groupRoutes = require('./module/groups/router')
const checkinRoutes = require('./module/checkins/router')
const errorHandler = require('./util/errorHandler')
const ApiError = require('./util/ApiError')
const app = express()
require('./util/passport')

/**
 * Get Client IP
 * 1. Edit nginx header like this "proxy_set_header X-Forwarded-For $remote_addr;"
 * 2. Enable trust proxy on express app "app.set('trust proxy', true)"
 * 3. Use "req.ip" to get Client IP
 */
app.set('trust proxy', true)

app.use('/_health', require('./module/health/router'))
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
