const databaseConnection = require('../../../database/connection')
const bcrypt = require('bcrypt')

module.exports = async (req, res, next) => {
  try {
    const collection = databaseConnection.getDatabase().collection('checkins')

    const result = await collection.insertOne({
      photo: req.body.photo,
      lat: req.body.lat,
      lng: req.body.lng,
      address: req.body.address,
      notes: req.body.notes
    })
    res.status(201).json({
      created: result.ops[0]
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}
