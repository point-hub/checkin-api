const databaseConnection = require('../../../database/connection')

module.exports = async (req, res, next) => {
  try {
    const users = databaseConnection.getDatabase().collection('users')
    console.log(req.query.emailToken)
    const result = await users.find({
      emailVerificationCode: req.query.emailToken
    }).toArray()

    if (result.length == 0) {
      return res.status(200).json({
        message: 'Code Verification not valid'
      })
    }

    await users.findOneAndUpdate({
      emailVerificationCode: req.query.emailToken
    }, {
      $set: {
        emailVerified: true
      }
    }, {
      returnOriginal: false
    })

    res.writeHead(302, {
      Location: `${process.env.DOMAIN_APP}`
    })
    res.end()
  } catch (error) {
    console.log('defd')
    next(error)
  }
}
