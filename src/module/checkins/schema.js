module.exports = {
  bsonType: 'object',
  required: ['photo', 'lat', 'lng', 'address', 'notes'],
  properties: {
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
      description: 'must be a string and is required'
    }
  }
}
