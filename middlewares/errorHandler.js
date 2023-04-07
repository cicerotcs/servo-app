const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };

  if (customError.statusCode === 500 || customError.statusCode === 404) {
    res.redirect("/");
  }

  res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandler;
