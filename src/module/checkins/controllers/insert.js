const databaseConnection = require('../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const collection = databaseConnection.getDatabase().collection('checkins')

    const result = await collection.insertOne({
      createdAt: new Date(),
      createdBy_id: req.user._id,
      group_id: ObjectID(req.body.group_id),
      photo: req.body.photo,
      lat: req.body.lat,
      lng: req.body.lng,
      address: req.body.address,
      addressComponents: req.body.addressComponents,
      notes: req.body.notes || '',
      user: {
        username: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName
      }
    })
    res.status(201).json({
      created: result.ops[0]
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}
