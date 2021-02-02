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

    if (typeof query.filter === 'string') {
      query.filter = JSON.parse(query.filter)
    }

    const result = await checkinsCollection.find({
      group_id: ObjectID(query.group_id)
    })
      .filter(qsp.filter(query.filter))
      .skip(qsp.skip((page - 1) * limit))
      .limit(qsp.limit(limit))
      .sort(qsp.sort(query.sort))
      .project(qsp.fields(query.fields, allowedFields, restrictedFields))
      .toArray()

    const totalDocument = await checkinsCollection.countDocuments(qsp.filter(query.filter))

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
