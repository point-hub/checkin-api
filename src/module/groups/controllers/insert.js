const databaseConnection = require('../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const groups = databaseConnection.getDatabase().collection('groups')
    const date = new Date()

    // get own groups
    const ownGroups = await groups.find({
      _id: ObjectID(id),
      createdBy_id: ObjectID(req.body.user_id)
    }).toArray()

    if (ownGroups >= 3) {
      const result = await groups.insertOne({
        createdAt: date,
        createdBy_id: req.user._id,
        name: req.body.name,
        status: 'active',
        users: [{
          id: req.user._id,
          username: req.user.username,
          email: req.user.email,
          firstName: req.user.firstName,
          lastName: req.user.lastName
        }]
      })
      res.status(201).json({
        created: result.ops[0]
      })
    } else {
      res.status(422).json({
        error: {
          message: 'max create 3 group per user'
        }
      })
    }
  } catch (error) {
    next(error)
  }
}
