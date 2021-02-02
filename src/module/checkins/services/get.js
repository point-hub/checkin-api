const { ObjectID } = require('mongodb')
const databaseConnection = require('../../../database/connection')
const qsp = require('../../../util/queryStringParse')

module.exports = async function (query) {
  try {
    // allowed fields to select
    const allowedFields = ['createdAt', 'createdBy_id', 'photo', 'lat', 'lng', 'address', 'notes']
    // restricted fields should not return to user request
    const restrictedFields = []

    const checkinsCollection = databaseConnection.getDatabase().collection('checkins')

    const limit = Number(query.limit) || 10
    const page = Number(query.page) || 1

    query.sort = '-createdAt'

    var queryFilter = qsp.filter(query.filter)
    queryFilter.group_id = ObjectID(queryFilter.group_id)

    const result = await checkinsCollection.find()
      .filter(queryFilter)
      .skip(qsp.skip((page - 1) * limit))
      .limit(qsp.limit(limit))
      .sort(qsp.sort(query.sort))
      .project(qsp.fields(query.fields, allowedFields, restrictedFields))
      .toArray()

    const totalDocument = await checkinsCollection.countDocuments(queryFilter)

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
