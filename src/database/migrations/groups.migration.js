const schema = require('../../module/groups/schema')

class GroupMigration {
  async up (db) {
    try {
      await db.createCollection('groups', {
        validator: {
          $jsonSchema: schema
        }
      })

      await db.collection('groups').createIndex({ name: -1 }, {
        unique: true,
        collation: {
          locale: 'en',
          strength: 2
        }
      })
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
