const databaseConnection = require('../../../database/connection')
const { ObjectID } = require('mongodb')
const User = require('../../users/services')

module.exports = async (req, res, next) => {
  try {
    const id = req.params.id

    const groups = databaseConnection.getDatabase().collection('groups')

    const userIsExistsInGroup = await groups.find({
      _id: ObjectID(id),
      'users.email': req.body.email
    }).toArray()

    let user = await User.get({
      filter: { email: req.body.email },
      fields: '_id, username, firstName, lastName, email'
    })
    if (user.data && user.data.length !== 0) {
      user = user.data[0]
    } else {
      user = {}
      user.email = req.body.email
    }
    if (userIsExistsInGroup.length === 0) {
      const result = await groups.findOneAndUpdate({
        _id: ObjectID(id)
      }, {
        $addToSet: {
          users: {
            ...user,
            invitedAt: new Date(),
            invitedBy_id: req.user._id,
            status: 'pending'
          }
        }
      }, {
        returnOriginal: false
      })

      return res.status(200).json({
        data: result.value
      })
    }
    return res.status(422).json({
      error: {
        message: 'email already exists'
      }
    })
  } catch (error) {
    next(error)
  }
}
