const databaseConnection = require('../../../database/connection')
const qsp = require('../../../util/queryStringParse')
const { ObjectID } = require('mongodb')

module.exports = async function (id, query = []) {
  try {
    // allowed fields to select
    const allowedFields = ['photo', 'lat', 'lng', 'address', 'notes']
    // restricted fields should not return to user request
    const restrictedFields = []

    const result = await databaseConnection.getDatabase().collection('checkins')
      .find({ _id: ObjectID(id) })
      .project(qsp.fields(query.fields, allowedFields, restrictedFields))
      .toArray()

    return result[0]
  } catch (error) {
    throw new Error(error)
  }
}
