const databaseConnection = require('../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const id = req.params.id
    const groups = databaseConnection.getDatabase().collection('groups')

    // get own groups
    const ownGroups = await groups.find({
      createdBy_id: req.user._id
    }).toArray()

    if (ownGroups.length > 1) {
      const result = await groups.findOneAndDelete({
        _id: ObjectID(id)
      })
      res.status(200).json({
        data: result.value
      })
    } else {
      res.status(200).json({
        error: {
          message: 'cannot delete this group'
        }
      })
    }
  } catch (error) {
    next(error)
  }
}
