module.exports = {
  bsonType: 'object',
  required: ['createdAt', 'createdBy_id', 'group_id', 'photo', 'lat', 'lng', 'address'],
  properties: {
    createdAt: {
      bsonType: 'date',
      description: 'must be a string and is required'
    },
    createdBy_id: {
      bsonType: 'objectId',
      description: 'must be a objectId and is required'
    },
    group_id: {
      bsonType: 'objectId',
      description: 'must be a objectId and is required'
    },
    photo: {
      bsonType: 'string',
      description: 'must be a string and is required'
    },
    lat: {
      bsonType: 'double',
      description: 'must be a double and is required'
    },
    lng: {
      bsonType: 'double',
      description: 'must be a double and is required'
    },
    address: {
      bsonType: 'string',
      description: 'must be a string and is required'
    },
    notes: {
      bsonType: 'string',
      description: 'must be a string'
    }
  }
}
