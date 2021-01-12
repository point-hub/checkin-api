const databaseConnection = require('../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const id = req.params.id
    const users = databaseConnection.getDatabase().collection('users')
    const groups = databaseConnection.getDatabase().collection('groups')

    const user = {
      firstName: req.body.firstName ?? req.user.firstName,
      lastName: req.body.lastName ?? req.user.lastName,
      username: req.body.username ?? req.user.username,
      email: req.body.email ?? req.user.password
    }

    const result = await users.findOneAndUpdate({
      _id: ObjectID(id)
    }, {
      $set: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.password,
        updatedAt: new Date(),
        updatedBy_id: req.user._id
      }
    }, {
      projection: {
        password: 0,
        emailVerificationCode: 0
      },
      returnOriginal: false
    })

    await groups.updateMany({
      'users._id': ObjectID(id)
    }, {
      $set: {
        'users.$[el].username': user.username,
        'users.$[el].firstName': user.firstName,
        'users.$[el].lastName': user.lastName,
        'users.$[el].email': user.email
      }
    }, { arrayFilters: [{ 'el._id': ObjectID(id) }] })

    res.status(200).json({
      data: result.value
    })
  } catch (error) {
    next(error)
  }
}
