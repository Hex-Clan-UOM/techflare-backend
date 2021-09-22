const { createLogger, format, transports } = require("winston");
const { combine, timestamp, colorize, printf } = format;
const path = require("path");
const appConfig = require("../../appConfig");

const logFilePath = path.join(__dirname + "/logs");

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] : ${message}`;
});

const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  myFormat
);
const fileFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  myFormat
);

const logger = createLogger({
  level: "debug",
  transports: [
    new transports.File({
      filename: logFilePath + "/app.log",
      format: fileFormat,
    }),
    new transports.File({
      filename: logFilePath + "/error.log",
      level: "error",
      format: fileFormat,
    }),
  ],
});

if (appConfig.environment !== "production") {
  logger.add(
    new transports.Console({
      format: consoleFormat,
    })
  );
}

module.exports = logger;
