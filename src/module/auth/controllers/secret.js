const Groups = require('../../groups/services')

module.exports = async (req, res, next) => {
  try {
    const groups = await Groups.get({
      filter: {
        'users.email': req.user.email
      }
    })
    const mapGroups = []
    groups.data.forEach(group => {
      group.users.forEach(user => {
        if (user.email === req.user.email) {
          mapGroups.push({
            _id: group._id,
            createdBy_id: group.createdBy_id,
            name: group.name,
            status: group.status,
            users: group.users,
            userStatus: user.status ?? 'active'
          })
        }
      })
    })

    res.status(200).json({
      data: req.user,
      includes: {
        groups: mapGroups
      }
    })
  } catch (error) {
    next(error)
  }
}
