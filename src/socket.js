const io = require('socket.io')()

function init (server) {
  io.attach(server, {
    cors: {
      origin: 'http://localhost:8080',
      methods: ['GET', 'POST']
    }
  })
}

io.on('connection', (socket) => {
  io.emit('appVersion', '0.3.1')
})

module.exports = {
  io,
  init
}
