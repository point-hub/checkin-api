const databaseConnection = require('../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const users = databaseConnection.getDatabase().collection('users')

    await users.findOneAndUpdate({
      _id: ObjectID(req.user._id)
    }, {
      $set: {
        lastOnline: new Date(),
        lastIp: req.ip
      }
    }, {
      projection: {
        password: 0,
        emailVerificationCode: 0
      },
      returnOriginal: false
    })
    next()
  } catch (error) {
    next(error)
  }
}
