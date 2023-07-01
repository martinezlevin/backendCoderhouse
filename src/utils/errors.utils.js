export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.code = 400;
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.code = 401;
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.code = 403;
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.code = 404;
    this.name = "NotFoundError";
  }
}

export class ServerError extends Error {
  constructor(message) {
    super(message);
    this.code = 500;
    this.name = "ServerError";
  }
}

export const instanceOfCustomError = (error) => {
  return (
    error instanceof BadRequestError ||
    error instanceof ServerError ||
    error instanceof UnauthorizedError ||
    error instanceof ForbiddenError
  );
};

export const handleCaughtError = (res, error) => {
  if (instanceOfCustomError(error)) {
    return res
      .status(error.code)
      .send({ status: "error", error: error.message });
  }
  return res.status(500).json({ status: "error", error: "server error" });
};