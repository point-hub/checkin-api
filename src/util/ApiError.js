class ApiError {
  constructor (code, message, optional = {}) {
    this.code = code
    this.message = message
    if (optional.errors) {
      this.errors = optional.errors
    }
  }

  static notFound () {
    return new ApiError(404, 'Not Found')
  }

  static badRequest (message) {
    return new ApiError(400, message)
  }

  static unprocessableEntity (message, errors) {
    return new ApiError(422, message, { ...errors })
  }

  static internalServerError () {
    return new ApiError(500, 'Internal Server Error')
  }
}

module.exports = ApiError
