import { type Middleware } from '@/application/protocols'
import { type HashComparer, type TokenDecoder, type LoadGuardianByIdRepository } from '@/data/protocols'
import { serverError, type HttpRequest, type HttpResponse, unauthorized, success } from '@/application/helpers'

export class AuthMiddleware implements Middleware {
  private readonly tokenDecoder: TokenDecoder
  private readonly hashComparer: HashComparer
  private readonly loadGuardianById: LoadGuardianByIdRepository

  constructor ({ tokenDecoder, hashComparer, loadGuardianById }: AuthMiddleware.Dependencies) {
    this.tokenDecoder = tokenDecoder
    this.hashComparer = hashComparer
    this.loadGuardianById = loadGuardianById
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.authorization) {
        return unauthorized()
      }

      let { authorization } = httpRequest
      if (authorization.startsWith('Bearer ')) {
        authorization = authorization.substring(7)
      }

      const payload = await this.tokenDecoder.decode(authorization)
      if (!payload) {
        return unauthorized()
      }

      const { sub: userId } = payload
      const account = await this.loadGuardianById.loadById(userId)
      if (!account) {
        return unauthorized()
      }

      const matchToken = await this.hashComparer.compare({
        hash: account.accessToken ?? '',
        value: authorization
      })
      if (!matchToken) {
        return unauthorized()
      }
      return success({ userId })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace AuthMiddleware {
  export interface Dependencies {
    tokenDecoder: TokenDecoder
    hashComparer: HashComparer
    loadGuardianById: LoadGuardianByIdRepository
  }
}
