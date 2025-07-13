import { ServerError, UnauthorizedError } from '@/application/errors'

export interface HttpRequest {
  query: any
  userId?: string
  params?: any
  body?: any
  authorization?: any
  file?: Buffer
}

export interface HttpResponse {
  statusCode: number
  body: any
}

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const notAcceptable = (error: Error): HttpResponse => ({
  statusCode: 406,
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

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null
})
