/**
 * Base application error class
 * All custom errors should extend this class
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      statusCode: this.statusCode,
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

/**
 * Validation error - 400
 * Used when request data doesn't meet validation requirements
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, message, 'VALIDATION_ERROR', details);
  }
}

/**
 * Not found error - 404
 * Used when a requested resource doesn't exist
 */
export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(404, message, 'NOT_FOUND', { resource, identifier });
  }
}

/**
 * Availability/Conflict error - 409
 * Used for booking conflicts, duplicate entries, etc.
 */
export class AvailabilityError extends AppError {
  constructor(message: string, conflicts?: unknown) {
    super(409, message, 'AVAILABILITY_CONFLICT', conflicts);
  }
}

/**
 * Unauthorized error - 401
 * Used when authentication is required but not provided
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(401, message, 'UNAUTHORIZED');
  }
}

/**
 * Forbidden error - 403
 * Used when user doesn't have permission for the requested action
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(403, message, 'FORBIDDEN');
  }
}

/**
 * Payment error - 402
 * Used for payment processing failures
 */
export class PaymentError extends AppError {
  constructor(message: string, details?: unknown) {
    super(402, message, 'PAYMENT_FAILED', details);
  }
}

/**
 * Rate limit error - 429
 * Used when user exceeds rate limits
 */
export class RateLimitError extends AppError {
  constructor(message = 'Too many requests. Please try again later.') {
    super(429, message, 'RATE_LIMIT_EXCEEDED');
  }
}

/**
 * Subscription limit error - 403
 * Used when user exceeds their subscription limits
 */
export class SubscriptionLimitError extends AppError {
  constructor(resource: string, limit: number) {
    super(
      403,
      `You have reached your ${resource} limit (${limit}). Please upgrade your plan.`,
      'SUBSCRIPTION_LIMIT_EXCEEDED',
      { resource, limit }
    );
  }
}

/**
 * External service error - 502
 * Used when external API/service fails
 */
export class ExternalServiceError extends AppError {
  constructor(service: string, message: string, details?: unknown) {
    super(
      502,
      `${service} service error: ${message}`,
      'EXTERNAL_SERVICE_ERROR',
      typeof details === 'object' && details !== null
        ? { service, ...details }
        : { service, details }
    );
  }
}
