import { Request, Response, NextFunction } from 'express'

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function errorHandler(
  error: Error | APIError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = error instanceof APIError ? error.statusCode : 500
  const message = error.message || 'Internal Server Error'

  console.error(`[${new Date().toISOString()}] Error:`, error)

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    },
  })
}
