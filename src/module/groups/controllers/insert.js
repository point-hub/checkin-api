const databaseConnection = require('../../../database/connection')

module.exports = async (req, res, next) => {
  try {
    const groups = databaseConnection.getDatabase().collection('groups')
    const date = new Date()

    // get own groups
    const ownGroups = await groups.find({
      createdBy_id: req.user._id
    }).toArray()

    if (ownGroups.length < 10) {
      const result = await groups.insertOne({
        createdAt: date,
        createdBy_id: req.user._id,
        name: req.body.name,
        status: 'active',
        users: [{
          _id: req.user._id,
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
          message: 'max create 10 group per user'
        }
      })
    }
  } catch (error) {
    next(error)
  }
}
