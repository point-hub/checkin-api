const User = require('../services')

module.exports = async (req, res, next) => {
  try {
    const result = await User.get(req.query)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}
