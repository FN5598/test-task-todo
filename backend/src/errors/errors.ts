export type AppErrorOptions = ErrorOptions & {
  metadata?: unknown;
};

export class AppError extends Error {
  public readonly metadata?: unknown;

  constructor(
    message: string,
    public readonly statusCode: number,
    options: AppErrorOptions = {},
  ) {
    const { metadata, ...errorOptions } = options;

    super(message, errorOptions);
    this.name = new.target.name;
    this.metadata = metadata;
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, options?: AppErrorOptions) {
    super(message, 400, options);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, options?: AppErrorOptions) {
    super(message, 404, options);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, options?: AppErrorOptions) {
    super(message, 409, options);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication is required", options?: AppErrorOptions) {
    super(message, 401, options);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = "Service is temporarily unavailable", options?: AppErrorOptions) {
    super(message, 503, options);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal server error", options?: AppErrorOptions) {
    super(message, 500, options);
  }
}

export type ValidationIssueMetadata = {
  field: string;
  code: string;
  message: string;
};

export class RequestValidationError extends BadRequestError {
  constructor(issues: ValidationIssueMetadata[]) {
    super("Request validation failed", { metadata: { issues } });
  }
}

export class EmailAlreadyRegisteredError extends ConflictError {
  constructor() {
    super("An account with this email already exists");
  }
}

export class InvalidCredentialsError extends UnauthorizedError {
  constructor() {
    super("Invalid email or password");
  }
}

export class InvalidRefreshTokenError extends UnauthorizedError {
  constructor(options?: AppErrorOptions) {
    super("Invalid or expired refresh token", options);
  }
}
