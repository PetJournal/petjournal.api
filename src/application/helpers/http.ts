import { ServerError, UnauthorizedError } from '@/application/errors'

export interface HttpRequest {
  body?: any
  authorization?: any
}

export interface HttpResponse {
  statusCode: number
  body: any
}

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const conflict = (error: Error): HttpResponse => ({
  statusCode: 409,
  body: error
})

export const unauthorized = (error?: Error): HttpResponse => ({
  statusCode: 401,
  body: error ?? new UnauthorizedError()
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack as string)
})

export const success = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const create = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
})
