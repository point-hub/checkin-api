const users = require('./migrations/users.migration')
const checkins = require('./migrations/checkins.migration')

class DatabaseMigration {
  async up (db) {
    try {
      await db.createCollection('migration')
      await users.up(db)
      await checkins.up(db)
    } catch (error) {
      throw new Error(error)
    }
  }

  async down (db) {
    try {
      await checkins.down(db)
      await users.down(db)
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new DatabaseMigration()
