const ApiError = require('./ApiError')
const MongoError = require('mongodb').MongoError
const logger = require('./logger')

const errorHandler = function (error, req, res, next) {
  // Inject user info who get this error
  error.request = {
    headers: req.headers,
    body: req.body,
    params: req.params,
    query: req.query,
    method: req.method,
    url: req.url,
    user: req.user
  }

  logger.error(error)

  if (error instanceof ApiError) {
    return res.status(error.code).json(error)
  }

  if (error instanceof MongoError) {
    return res.status(500).json(error)
  }

  return res.status(500).json('something went wrong')
}

module.exports = errorHandler
