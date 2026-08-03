import axios from 'axios';

/**
 * Таксономія мережевих помилок (стаття 14):
 * Network / Timeout / Server / Unauthorized / NotFound / Validation / Unknown.
 * userMessage — текст для UI; originalError — для логів.
 */
export enum ErrorKind {
  Network = 'NETWORK',
  Timeout = 'TIMEOUT',
  Server = 'SERVER',
  Unauthorized = 'UNAUTHORIZED',
  NotFound = 'NOT_FOUND',
  Validation = 'VALIDATION',
  Unknown = 'UNKNOWN',
}

export class AppError extends Error {
  constructor(
    public readonly kind: ErrorKind,
    public readonly userMessage: string,
    public readonly statusCode?: number,
    public readonly originalError?: unknown,
  ) {
    super(userMessage);
    this.name = 'AppError';
  }

  static from(error: unknown): AppError {
    if (error instanceof AppError) return error;

    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return new AppError(
          ErrorKind.Timeout,
          'Запит тривав занадто довго. Перевірте з’єднання.',
          undefined,
          error,
        );
      }

      if (!error.response) {
        return new AppError(
          ErrorKind.Network,
          'Відсутнє з’єднання з інтернетом або сервером.',
          undefined,
          error,
        );
      }

      const status = error.response.status;
      if (status === 401) {
        return new AppError(
          ErrorKind.Unauthorized,
          'Сесія вичерпана. Увійдіть знову.',
          status,
          error,
        );
      }
      if (status === 404) {
        return new AppError(
          ErrorKind.NotFound,
          'Запитуваний ресурс не знайдено.',
          status,
          error,
        );
      }
      if (status >= 400 && status < 500) {
        return new AppError(
          ErrorKind.Validation,
          'Сервер відхилив запит. Перевірте дані.',
          status,
          error,
        );
      }
      if (status >= 500) {
        return new AppError(
          ErrorKind.Server,
          'На сервері сталася помилка. Спробуйте пізніше.',
          status,
          error,
        );
      }
    }

    return new AppError(
      ErrorKind.Unknown,
      'Сталася несподівана помилка.',
      undefined,
      error,
    );
  }
}
