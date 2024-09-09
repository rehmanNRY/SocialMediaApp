class ApiError extends Error{
  constructor(
    statusCode, 
    message = "something went wrong", 
    stack = "",
    errors = []){
      super(message)
      this.statusCode = statusCode;
      this.data = data;
      this.errors = errors;
      this.message = message;
      this.success = false;
      if(stack){
        this.stack = stack;
      }else{
        Error.captureStackTrace(this, this.constructor)
      }
  }
}

export {ApiError}