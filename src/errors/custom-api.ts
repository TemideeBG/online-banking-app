import { StatusCodes } from 'http-status-codes';

class CustomAPIError extends Error {
  statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR; // Default status code

  constructor(message: string) {
    super(message);
    // Set the prototype explicitly to ensure correct behavior
    Object.setPrototypeOf(this, CustomAPIError.prototype);
  }
}

export default CustomAPIError;

  