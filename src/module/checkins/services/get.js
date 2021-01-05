const databaseConnection = require('../../../database/connection')
const qsp = require('../../../util/queryStringParse')

module.exports = async function (query) {
  try {
    // allowed fields to select
    const allowedFields = ['photo', 'lat', 'lng', 'address', 'notes']
    // restricted fields should not return to user request
    const restrictedFields = []

    const result = await databaseConnection.getDatabase().collection('checkins')
      .find()
      .filter(qsp.filter(query.filter))
      .skip(qsp.skip(query.skip))
      .limit(qsp.limit(query.limit))
      .sort(qsp.sort(query.sort))
      .project(qsp.fields(query.fields, allowedFields, restrictedFields))
      .toArray()

    return result
  } catch (error) {
    return new Error(error)
  }
}
