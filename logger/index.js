const devLogger = require("./devLogger");
let logger;

if (process.env.NODE_ENV !== "production") {
  logger = devLogger();
}

module.exports = logger;
