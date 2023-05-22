import { type Middleware } from '@/application/middlewares/middleware'
import { serverError, type HttpRequest, type HttpResponse, unauthorized, success } from '../helpers/http'
import { type TokenDecoder } from '@/data/protocols/cryptography/token-decoder'
import { type LoadGuardianByIdRepository } from '@/data/protocols/guardian/load-guardian-by-id-repository'
import { type HashComparer } from '@/data/protocols'

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
      const { authorization } = httpRequest
      const payload = await this.tokenDecoder.decode(authorization)
      if (!payload) {
        return unauthorized()
      }
      const { sub: userId } = payload
      const account = await this.loadGuardianById.loadById(userId)
      if (!account) {
        return unauthorized()
      }
      const matchToken = await this.hashComparer.compare({ hash: account.accessToken ?? '', value: authorization })
      if (!matchToken) {
        return unauthorized()
      }
      return success({ userId })
    } catch (error) {
      console.error(error)
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
