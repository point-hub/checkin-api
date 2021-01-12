const databaseConnection = require('../../../database/connection')
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const authConfig = require('../../../config/auth')
const mailer = require('../../../util/mailer')

module.exports = async (req, res, next) => {
  try {
    const date = new Date()
    const users = databaseConnection.getDatabase().collection('users')
    // create new user
    const hashPassword = await bcrypt.hash(req.body.password, 10)
    const emailVerficicationCode = crypto.randomBytes(20).toString('hex')
    const result = await users.insertOne({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
      // system generated value
      emailVerified: false,
      emailVerificationCode: emailVerficicationCode,
      createdAt: date
    })

    // sign new token
    const token = JWT.sign(({
      iss: 'checkin',
      sub: result.ops[0]._id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 30)
    }), authConfig.secret)

    const data = {
      _id: result.ops[0]._id,
      username: result.ops[0].username,
      firstName: result.ops[0].firstName,
      lastName: result.ops[0].lastName,
      email: result.ops[0].email,
      created_at: result.ops[0].created_at,
      token: token
    }

    // create default group
    const groups = databaseConnection.getDatabase().collection('groups')
    const groupsResult = await groups.insertOne({
      createdAt: date,
      createdBy_id: result.ops[0]._id,
      name: `${result.ops[0].username}-${require('crypto').randomBytes(8).toString('hex')}`,
      status: 'active',
      users: [{
        _id: result.ops[0]._id,
        username: result.ops[0].username,
        email: result.ops[0].email,
        firstName: result.ops[0].firstName,
        lastName: result.ops[0].lastName
      }]
    })

    // const message = {
    //   to: req.body.email,
    //   subject: 'CHECKIN Registration ',
    //   html: 'Welcome, ...'
    // }

    // mailer.send(message)

    res.status(201).json({
      data: {
        ...data,
        groups: [
          groupsResult.ops[0]
        ]
      }
    })
  } catch (error) {
    next(error)
  }
}
