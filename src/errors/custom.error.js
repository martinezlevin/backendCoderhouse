export default class CustomError {
    static customError(code, info, message) {
      const error = new Error(message);
      error.code = code;
      error.info = info;
      throw error;
    }
  }