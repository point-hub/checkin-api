const ApiError = require('./ApiError')

const errorHandler = function (error, req, res, next) {
  console.log('error handler')
  if (error instanceof ApiError) {
    const data = {
      error: {
        message: error.message
      }
    }

    if (error.errors) {
      data.error.errors = error.errors
    }

    return res.status(error.code).json(data)
  }

  return res.status(500).json('something went wrong')
}

module.exports = errorHandler
