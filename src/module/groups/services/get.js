const databaseConnection = require('../../../database/connection')
const qsp = require('../../../util/queryStringParse')

module.exports = async function (query) {
  try {
    // allowed fields to select
    const allowedFields = ['name', 'status']
    // restricted fields should not return to user request
    const restrictedFields = []

    const groupCollection = databaseConnection.getDatabase().collection('groups')

    const limit = Number(query.limit) || 10
    const page = Number(query.page) || 1

    const result = await groupCollection.find()
      .filter(qsp.filter(query.filter))
      .skip(qsp.skip((page - 1) * limit))
      .limit(qsp.limit(limit))
      .sort(qsp.sort(query.sort))
      .project(qsp.fields(query.fields, allowedFields, restrictedFields))
      .toArray()

    const totalDocument = await groupCollection.countDocuments(qsp.filter(query.filter))

    return {
      page: page,
      totalPerPage: limit,
      totalPage: Math.ceil(totalDocument / limit),
      totalDocument,
      data: result
    }
  } catch (error) {
    return new Error(error)
  }
}
