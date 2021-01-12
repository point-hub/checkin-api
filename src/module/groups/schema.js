module.exports = {
  bsonType: 'object',
  required: ['createdAt', 'createdBy_id', 'name'],
  properties: {
    createdAt: {
      bsonType: 'date',
      description: 'must be a string and is required'
    },
    createdBy_id: {
      bsonType: 'objectId',
      description: 'must be an objectId and reference users collection'
    },
    name: {
      bsonType: 'string',
      minLength: 3,
      maxLength: 64,
      description: 'must be a string and is required'
    },
    users: {
      bsonType: 'array',
      description: 'must be an array'
    },
    status: {
      bsonType: 'string',
      enum: ['active', 'suspended'],
      description: 'must be a string between active or suspended'
    }
  }
}
