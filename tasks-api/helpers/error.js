// This file contains helper functions to create errors
const createError =  (message, code) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

// This function creates an error and throws it
const createAndThrowError = (message, code) => {
  throw createError(message, code);
}

exports.createAndThrowError = createAndThrowError;
exports.createError = createError;
