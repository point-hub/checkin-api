const databaseConnection = require('../../../database/connection')
const qsp = require('../../../util/queryStringParse')

module.exports = async function (query) {
  try {
    // allowed fields to select
    const allowedFields = ['username', 'firstName', 'lastName', 'email']
    // restricted fields should not return to user request
    const restrictedFields = ['password', 'emailVerificationCode']

    const userCollection = databaseConnection.getDatabase().collection('users')

    const limit = Number(query.limit) || 10
    const page = Number(query.page) || 1

    const result = await userCollection.find()
      .filter(qsp.filter(query.filter))
      .skip(qsp.skip((page - 1) * limit))
      .limit(qsp.limit(limit))
      .sort(qsp.sort(query.sort))
      .project(qsp.fields(query.fields, allowedFields, restrictedFields))
      .toArray()

    const totalDocument = await userCollection.countDocuments(qsp.filter(query.filter))

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
