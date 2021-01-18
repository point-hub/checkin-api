const app = require('./src/app')
const io = require('./src/socket')

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  console.log(`Checkin API listening at http://localhost:${port}`)
})

io.init(server)

module.exports = server
