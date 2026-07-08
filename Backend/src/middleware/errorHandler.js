const logger = require("../config/logger");

function errorHandler(err, req, res, _next) {
  logger.error(err.message);

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "ZodError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.errors.map((e) => ({ path: e.path.join("."), message: e.message })),
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: "Resource already exists" });
  }

  const status = err.status || 500;
  res.status(status).json({
    message: status === 500 ? "Internal server error" : err.message,
  });
}

module.exports = errorHandler;
