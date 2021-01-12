const databaseConnection = require('../../../database/connection')
const { ObjectID } = require('mongodb')
const User = require('../../users/services')

module.exports = async (req, res, next) => {
  try {
    const id = req.params.id

    const groups = databaseConnection.getDatabase().collection('groups')

    const user = await User.find(ObjectID(req.body.user_id))

    const result = await groups.findOneAndUpdate({
      _id: ObjectID(id)
    }, {
      $addToSet: {
        users: {
          _id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      }
    }, {
      returnOriginal: false
    })

    res.status(200).json({
      data: result.value
    })
  } catch (error) {
    next(error)
  }
}
