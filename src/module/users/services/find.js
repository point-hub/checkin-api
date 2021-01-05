const databaseConnection = require('../../../database/connection')
const qsp = require('../../../util/queryStringParse')
const { ObjectID } = require('mongodb')

module.exports = async function (id, query = []) {
  try {
    // allowed fields to select
    const allowedFields = ['username', 'fname', 'lname', 'email']
    // restricted fields should not return to user request
    const restrictedFields = ['password']

    const result = await databaseConnection.getDatabase().collection('users')
      .find({ _id: ObjectID(id) })
      .project(qsp.fields(query.fields, allowedFields, restrictedFields))
      .toArray()

    return result[0]
  } catch (error) {
    throw new Error(error)
  }
}
