const { createLogger, format, transports } = require('winston')
const DailyRotateFile = require("winston-daily-rotate-file");


const logLevels = {
    fatat: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5
}


const logger = createLogger({
    levels: logLevels,
    format: format.combine(format.timestamp(), format.json()),
    transports: [
        new DailyRotateFile({ filename: './logs/error-%DATE%.log', level: 'error', maxSize: '20m' }),
        new DailyRotateFile({ filename: './logs/warn-%DATE%.log', level: 'warn', maxSize: '20m' }),
        new DailyRotateFile({ filename: './logs/info-%DATE%.log', level: 'info', maxSize: '20m' })
    ]
})

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
      format: format.combine(format.timestamp(), format.json())
    }));
  }


module.exports = logger