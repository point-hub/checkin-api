const databaseConnection = require('../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const id = req.params.id
    const groups = databaseConnection.getDatabase().collection('groups')
    const result = await groups.findOneAndUpdate({
      _id: ObjectID(id)
    }, {
      $set: {
        status: 'suspended'
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
