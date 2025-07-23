import { type Middleware } from '@/application/protocols'
import { type HttpRequest, type HttpResponse } from '@/application/helpers'
import { type Request, type Response, type NextFunction } from 'express'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      authorization: req.headers?.authorization,
      userId: req.userId,
      body: req.body,
      query: req.query
    }
    const httpResponse: HttpResponse = await middleware.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
      req.userId = httpResponse.body.userId
      next()
    } else if (httpResponse.statusCode === 204) {
      next()
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
