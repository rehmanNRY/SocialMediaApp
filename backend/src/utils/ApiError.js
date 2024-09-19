class ApiError extends Error {
  constructor(
    statusCode,
    message = "something went wrong",
    stack = "",
    errors = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors; // If you want to pass validation errors or other detailed error info
    this.message = message;
    this.success = false;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };