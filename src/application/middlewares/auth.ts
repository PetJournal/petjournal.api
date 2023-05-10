import { type Middleware } from '@/application/middlewares/middleware'
import { serverError, type HttpRequest, type HttpResponse, unauthorized, success } from '../helpers/http'
import { type TokenDecoder } from '@/data/protocols/cryptography/token-decoder'

export class AuthMiddleware implements Middleware {
  private readonly tokenDecoder: TokenDecoder

  constructor (tokenDecoder: TokenDecoder) {
    this.tokenDecoder = tokenDecoder
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['authorization']
      for (const field of requiredFields) {
        if (httpRequest.header[field] === undefined) {
          return unauthorized()
        }
      }
      const { authorization } = httpRequest.header

      const payload = await this.tokenDecoder.decode(authorization)

      if (!payload) {
        return unauthorized()
      }
      return success({ userId: 'any_id' })
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
