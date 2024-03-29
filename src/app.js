const express = require('express')
const app = express()
const helmet = require('helmet')
const xssClean = require('xss-clean')
const cors = require('cors')
const compression = require('compression')
const mongoSanitize = require('express-mongo-sanitize')
const databaseConnection = require('./database/connection')
const logger = require('./util/logger')

// gzip compressing can greatly decrease the size of the response body and hence increase the speed of a web app
app.use(compression())

// run database if not in test environment
if (process.env.NODE_ENV !== 'test') {
  databaseConnection.connect().catch(error => {
    console.log(error)
  })
}

// logger
if (process.env.NODE_ENV !== 'test') {
  app.use(require('morgan')('combined', { stream: logger.stream }))
}

// parse json request body
app.use(express.json({ limit: '50mb' }))

// parse urlencoded request body
app.use(express.urlencoded({ limit: '50mb', extended: false }))

// set security HTTP headers
app.use(helmet())

// make sure this comes before any routes
app.use(xssClean())

// sanitize mongodb security
app.use(mongoSanitize())

// cors
app.use(cors())

// v1 api routes
app.use('/v1', require('./router'))

module.exports = app
