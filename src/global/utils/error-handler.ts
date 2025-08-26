export interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

export function handleError(error: unknown): ApiError {
  if (error instanceof Error) {
    return error as ApiError;
  }

  if (typeof error === 'string') {
    return { name: 'Error', message: error } as ApiError;
  }

  return { name: 'Error', message: 'Something went wrong' } as ApiError;
}
