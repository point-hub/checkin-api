const databaseConnection = require('../../../database/connection')
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const authConfig = require('../../../config/auth')
const mailer = require('../../../util/mailer')
const Validator = require('validatorjs')
const ApiError = require('../../../util/ApiError')
const axios = require('axios').default

function validateRequest (data) {
  const rules = {
    firstName: 'required|string',
    lastName: 'required|string',
    username: 'required|alpha_num',
    email: 'required|email',
    password: 'required|min:8'
  }

  const validation = new Validator(data, rules)

  if (validation.fails()) {
    throw ApiError.unprocessableEntity('Unprocessable Entity', validation.errors)
  }
}

module.exports = async (req, res, next) => {
  try {
    validateRequest(req.body)
    const recaptchaResponse = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GRECAPTCHA_SECRET}&response=${req.body.recaptcha}`)

    //if (!recaptchaResponse.data.success) {
    //  return res.status(442).json({
    //    error: {
    //      message: 'Captcha validation failed'
    //    }
    //  })
    //}

    const { firstName, lastName, username, email, password } = req.body

    const date = new Date()
    const users = databaseConnection.getDatabase().collection('users')
    // create new user
    const hashPassword = await bcrypt.hash(password, 10)
    const emailVerficicationCode = crypto.randomBytes(20).toString('hex')
    const result = await users.insertOne({
      firstName: firstName,
      lastName: lastName,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashPassword,
      // system generated value
      emailVerified: false,
      emailVerificationCode: emailVerficicationCode,
      createdAt: date,
      registrationIp: req.ip
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
      createdBy_id: data._id,
      name: `${data.username}-${require('crypto').randomBytes(8).toString('hex')}`,
      status: 'active',
      users: [{
        _id: data._id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName
      }]
    })

    const verificationEmailUrl = `${process.env.DOMAIN_API}/v1/auth/verify-email?emailToken=${result.ops[0].emailVerificationCode}`

    const message = {
      to: email,
      subject: 'Point Checkin Verification Account',
      html: `Thanks for signin up, ${firstName} ${lastName}
      <p>please click link below to verify your email address to get access to our apps.</p>
      <a href="${verificationEmailUrl}">${verificationEmailUrl}</a>`
    }

    mailer.send(message)

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
