/**
 * Structured logger for the application
 *
 * This is a lightweight implementation that can be upgraded to Winston/Pino later.
 * To upgrade to Winston:
 * 1. npm install winston
 * 2. Replace the implementation below with Winston
 * 3. Keep the same interface (info, warn, error, debug)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMetadata {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment: boolean;
  private minLevel: LogLevel;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
    this.minLevel = this.isDevelopment ? 'debug' : 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(level);
    const minLevelIndex = levels.indexOf(this.minLevel);
    return currentLevelIndex >= minLevelIndex;
  }

  private formatMessage(level: LogLevel, message: string, metadata?: LogMetadata): string {
    const timestamp = new Date().toISOString();
    const levelStr = level.toUpperCase().padEnd(5);

    if (this.isDevelopment) {
      // Human-readable format for development
      const metaStr = metadata ? `\n${JSON.stringify(this.sanitize(metadata), null, 2)}` : '';
      return `[${timestamp}] ${levelStr} ${message}${metaStr}`;
    } else {
      // JSON format for production (easier to parse by log aggregators)
      const sanitizedMeta = this.sanitize(metadata);
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...(typeof sanitizedMeta === 'object' && sanitizedMeta !== null ? sanitizedMeta : {}),
      });
    }
  }

  /**
   * Sanitize sensitive data from logs
   * Removes passwords, tokens, API keys, etc.
   */
  private sanitize(data: unknown): unknown {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitize(item));
    }

    const sanitized: Record<string, unknown> = {};
    const sensitiveKeys = [
      'password',
      'token',
      'accessToken',
      'refreshToken',
      'apiKey',
      'secret',
      'accessKey',
      'secretKey',
      'creditCard',
      'cvv',
      'ssn',
      'idNumber',
    ];

    const dataObj = data as Record<string, unknown>;
    for (const [key, value] of Object.entries(dataObj)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = sensitiveKeys.some((sensitiveKey) =>
        lowerKey.includes(sensitiveKey.toLowerCase())
      );

      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else if (value && typeof value === 'object') {
        sanitized[key] = this.sanitize(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Log debug information (only in development)
   */
  debug(message: string, metadata?: LogMetadata): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, metadata));
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, metadata?: LogMetadata): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, metadata));
    }
  }

  /**
   * Log warnings
   */
  warn(message: string, metadata?: LogMetadata): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, metadata));
    }
  }

  /**
   * Log errors
   */
  error(message: string, metadata?: LogMetadata): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, metadata));
    }
  }

  /**
   * Log errors with stack trace
   */
  errorWithStack(message: string, error: Error, metadata?: LogMetadata): void {
    this.error(message, {
      ...metadata,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    });
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Helper to log HTTP requests
 */
export function logRequest(method: string, path: string, metadata?: LogMetadata): void {
  logger.info(`${method} ${path}`, metadata);
}

/**
 * Helper to log successful operations
 */
export function logSuccess(operation: string, metadata?: LogMetadata): void {
  logger.info(`✓ ${operation}`, metadata);
}

/**
 * Helper to log failed operations
 */
export function logFailure(operation: string, error: Error, metadata?: LogMetadata): void {
  logger.errorWithStack(`✗ ${operation}`, error, metadata);
}

/**
 * Performance logger
 * Measures and logs execution time of async operations
 *
 * @example
 * const duration = await measurePerformance('fetchBookings', async () => {
 *   return await bookingService.findAll();
 * });
 */
export async function measurePerformance<T>(
  operation: string,
  fn: () => Promise<T>,
  metadata?: LogMetadata
): Promise<T> {
  const startTime = Date.now();

  try {
    const result = await fn();
    const duration = Date.now() - startTime;

    if (duration > 1000) {
      logger.warn(`Slow operation: ${operation} took ${duration}ms`, {
        ...metadata,
        duration,
      });
    } else {
      logger.debug(`${operation} completed in ${duration}ms`, {
        ...metadata,
        duration,
      });
    }

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`${operation} failed after ${duration}ms`, {
      ...metadata,
      duration,
      error: error instanceof Error ? { name: error.name, message: error.message } : error,
    });
    throw error;
  }
}
