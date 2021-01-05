const databaseConnection = require('../../../database/connection')
const authConfig = require('../../../config/auth')
const JWT = require('jsonwebtoken')
const qsp = require('../../../util/queryStringParse')

module.exports = async (req, res, next) => {
  try {
    const query = req.query
    const allowedFields = ['username', 'email']
    const restrictedFields = ['password']

    const result = await databaseConnection.getDatabase()
      .collection('users')
      .find({
        email: req.body.email
      })
      .filter(qsp.filter(query.filter))
      .skip(qsp.skip(query.skip))
      .limit(qsp.limit(query.limit))
      .sort(qsp.sort(query.sort))
      .project(qsp.fields(query.fields, allowedFields, restrictedFields))
      .toArray()

    // sign new token
    const token = JWT.sign(({
      iss: 'checkin',
      sub: result[0]._id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 30)
    }), authConfig.secret)

    const resultObject = {
      ...result[0],
      token: token
    }

    res.status(200).json({
      data: {
        ...resultObject
      }
    })
  } catch (error) {
    next(error)
  }
}
