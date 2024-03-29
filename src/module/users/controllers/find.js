const User = require('../services')

module.exports = async (req, res, next) => {
  try {
    const result = await User.find(req.params.id)

    res.status(200).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}
