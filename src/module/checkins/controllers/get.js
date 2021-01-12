const Checkin = require('../services')

module.exports = async (req, res, next) => {
  try {
    const result = await Checkin.get(req.query)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}
