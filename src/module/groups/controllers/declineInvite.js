const databaseConnection = require('../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const id = req.params.id
    console.log('as')
    const groups = databaseConnection.getDatabase().collection('groups')

    const userIsExistsInGroup = await groups.find({
      _id: ObjectID(id),
      'users.email': req.user.email
    }).toArray()

    if (userIsExistsInGroup.length === 1) {
      const result = await groups.findOneAndUpdate({
        _id: ObjectID(id)
      }, {
        $pull: {
          users: {
            email: req.user.email
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
        message: 'user not exists in this group'
      }
    })
  } catch (error) {
    next(error)
  }
}
