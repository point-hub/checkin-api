const schema = require('../../module/checkins/schema')

class UsersMigration {
  async up (db) {
    try {
      await db.createCollection('checkins', {
        validator: {
          $jsonSchema: schema
        }
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  async down (db) {
    try {
      await db.collection('checkins').drop()
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new UsersMigration()
