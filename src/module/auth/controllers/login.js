const authConfig = require('../../../config/auth')
const JWT = require('jsonwebtoken')
const Groups = require('../../groups/services')
const Users = require('../../users/services')
const Auth = require('../../auth/services')
const bcrypt = require('bcrypt')
const ApiError = require('../../../util/ApiError')

module.exports = async (req, res, next) => {
  try {
    const user = await Auth.get({
      filter: {
        email: req.body.email
      }
    })
    
    // handle if user doesn't exists
    if (user.length === 0) {
      throw new ApiError(401)
    }
    // handle wrong password
    const isPasswordMatch = await bcrypt.compare(req.body.password, user[0].password)
    if (!isPasswordMatch) {
      throw new ApiError(401)
    }

    const users = await Users.get({
      filter: {
        email: req.body.email
      }
    })

    if (users.data[0].emailVerified === false) {
      // TODO: Temporary disable email verification check until mail service fixed
      // return res.status(401).json({
      //   error: {
      //     message: 'Your email address is not verified'
      //   }
      // })
    }

    const groups = await Groups.get({
      filter: {
        'users.email': req.body.email
      }
    })
    const mapGroups = []
    groups.data.forEach(group => {
      group.users.forEach(user => {
        if (user.email === req.body.email) {
          mapGroups.push({
            _id: group._id,
            owner_id: group.owner_id,
            name: group.name,
            status: group.status,
            users: group.users,
            userStatus: user.status ?? 'active'
          })
        }
      })
    })

    // sign new token
    const token = JWT.sign(({
      iss: 'checkin',
      sub: users.data[0]._id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 30)
    }), authConfig.secret)

    const resultObject = {
      ...users.data[0],
      token: token
    }

    res.status(200).json({
      data: {
        ...resultObject
      },
      includes: {
        groups: mapGroups
      }
    })
  } catch (error) {
    next(error)
  }
}
