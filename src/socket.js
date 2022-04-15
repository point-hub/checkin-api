const io = require('socket.io')()

function init (server) {
  io.attach(server, {
    cors: {
      origin: process.env.DOMAIN_APP,
      methods: ['GET', 'POST']
    }
  })
}

io.on('connection', (socket) => {
  io.emit('appVersion', '0.5.1')
})

module.exports = {
  io,
  init
}
