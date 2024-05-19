/** @format */

const { createLogger, transports, format} = require("winston");
const fs = require('fs');

const loggers = createLogger ({
    transports: [
        new transports.Console({
            level: "info",
        }),
        new transports.File({
            filename: "info.log",
            format: format.combine(format.timestamp(), format.json()),
        })
    ]
});

module.exports.loggers = loggers;