import { type Middleware } from '@/application/middlewares/middleware'
import { serverError, type HttpRequest, type HttpResponse, unauthorized } from '../helpers/http'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      return unauthorized()
    } catch (error) {
      return serverError()
    }
  }
}
