const schema = require('../../module/groups/schema')

class GroupMigration {
  async up (db) {
    try {
      await db.createCollection('groups', {
        validator: {
          $jsonSchema: schema
        }
      })

      await db.collection('groups').createIndex({ name: -1 }, { unique: true })
    } catch (error) {
      throw new Error(error)
    }
  }

  async down (db) {
    try {
      await db.collection('groups').drop()
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new GroupMigration()
