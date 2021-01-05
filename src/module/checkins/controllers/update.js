const databaseConnection = require('../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const id = req.params.id
    const checkins = databaseConnection.getDatabase().collection('checkins')
    const result = await checkins.findOneAndUpdate({
      _id: ObjectID(id)
    }, {
      $set: {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
      }
    }, {
      returnOriginal: false
    })
    res.status(200).json({
      updated: result.value
    })
  } catch (error) {
    next(error)
  }
}
