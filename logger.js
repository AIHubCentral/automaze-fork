const path = require('node:path');
const winston = require('winston');

const logsDir = path.join(__dirname, 'logs');

// Ensure the logs directory exists
const fs = require('fs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        new winston.transports.File({
            filename: path.join(logsDir, 'combined.log'),
            maxsize: 10_485_760,
        }),
    ],
});

module.exports = logger;
