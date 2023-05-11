import { type Middleware } from '@/application/middlewares/middleware'
import { serverError, type HttpRequest, type HttpResponse, unauthorized, success } from '../helpers/http'
import { type TokenDecoder } from '@/data/protocols/cryptography/token-decoder'
import { type LoadGuardianByIdRepository } from '@/data/protocols/guardian/load-guardian-by-id-repository'

export class AuthMiddleware implements Middleware {
  private readonly tokenDecoder: TokenDecoder
  private readonly loadGuardianById: LoadGuardianByIdRepository

  constructor ({ tokenDecoder, loadGuardianById }: AuthMiddleware.Dependencies) {
    this.tokenDecoder = tokenDecoder
    this.loadGuardianById = loadGuardianById
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
      const { userId } = payload
      const account = await this.loadGuardianById.loadById(userId)
      if (!account) {
        return unauthorized()
      }
      return success({ userId: 'any_id' })
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}

export namespace AuthMiddleware {
  export interface Dependencies {
    tokenDecoder: TokenDecoder
    loadGuardianById: LoadGuardianByIdRepository
  }
}
