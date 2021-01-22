const { createLogger, format, transports } = require('winston')
const { combine, timestamp, prettyPrint, errors } = format
require('winston-daily-rotate-file')

var errorTransport = new (transports.DailyRotateFile)({
  filename: 'logs/errors-%DATE%.log',
  datePattern: 'YYYY-MM-DD(HH)',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '7d',
  level: 'error',
  handleExceptions: false,
  handleRejections: false,
  json: true
})

var rejectionTransport = new (transports.DailyRotateFile)({
  filename: 'logs/rejections-%DATE%.log',
  datePattern: 'YYYY-MM-DD(HH)',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '7d',
  handleExceptions: false,
  handleRejections: true,
  json: true
})

var exceptionTransport = new (transports.DailyRotateFile)({
  filename: 'logs/exceptions-%DATE%.log',
  datePattern: 'YYYY-MM-DD(HH)',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '7d',
  handleExceptions: true,
  handleRejections: false,
  json: true
})

const logger = createLogger({
  exitOnError: false,
  format: combine(
    errors({ stack: true }),
    timestamp(),
    prettyPrint()
  ),
  transports: [errorTransport],
  rejectionHandlers: [rejectionTransport],
  exceptionHandlers: [exceptionTransport]
})

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console())
}

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function (message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message)
  }
}

module.exports = logger
