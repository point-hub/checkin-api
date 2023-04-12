const JWT = require('jsonwebtoken')
const authConfig = require('../config/auth');
const User = require('../module/users/services');
const ApiError = require('../util/ApiError')

module.exports = async function (req, res, next) {
  try {
    const bearerToken = req.headers.authorization
    const token = bearerToken.split(' ')
    const jwtAuth = JWT.verify(token[1], authConfig.secret)

    // find user token
    const user = await User.find(jwtAuth.sub)
    // handle if user doesn't exists
    if (!user) {
      throw new ApiError(401)
    }
    // return user
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
};
