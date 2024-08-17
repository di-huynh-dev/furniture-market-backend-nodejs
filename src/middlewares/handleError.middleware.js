const errorHandlingMiddleware = (error, req, res, next) => {
  const status = error.status || 500;

  return res.status(status).json({
    status: "error",
    code: status,
    stack: error.stack,
    message: error.message || "Internal Server Error",
  });
};

const notFoundMiddleware = (req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
};

module.exports = {
  notFoundMiddleware,
  errorHandlingMiddleware,
};
