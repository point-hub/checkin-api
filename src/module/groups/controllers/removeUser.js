const databaseConnection = require('../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const id = req.params.id
    const groups = databaseConnection.getDatabase().collection('groups')

    // check if user is a group owner
    const userIsOwner = await groups.find({
      _id: ObjectID(id),
      createdBy_id: ObjectID(req.body.user_id)
    }).toArray()

    if (userIsOwner.length > 0) {
      return res.status(422).json({
        error: {
          code: '422',
          message: 'User is a group owner'
        }
      })
    }

    const result = await groups.findOneAndUpdate({
      _id: ObjectID(id)
    }, {
      $pull: {
        users: {
          _id: ObjectID(req.body.user_id)
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
