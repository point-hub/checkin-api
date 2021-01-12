const Groups = require('../services')

module.exports = async (req, res, next) => {
  try {
    const result = await Groups.get(req.query)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}
