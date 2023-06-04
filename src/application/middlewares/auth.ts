import { type Middleware } from '@/application/middlewares/middleware'
import { serverError, type HttpRequest, type HttpResponse, unauthorized, success } from '../helpers/http'
import { type TokenDecoder } from '@/data/protocols/cryptography/token-decoder'
import { type LoadGuardianByIdRepository } from '@/data/protocols/guardian/load-guardian-by-id-repository'
import { type HashComparer } from '@/data/protocols'

export class AuthMiddleware implements Middleware {
  private readonly tokenService: TokenDecoder
  private readonly hashService: HashComparer
  private readonly guardianRepository: LoadGuardianByIdRepository

  constructor ({ tokenService, hashService, guardianRepository }: AuthMiddleware.Dependencies) {
    this.tokenService = tokenService
    this.hashService = hashService
    this.guardianRepository = guardianRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.authorization) {
        return unauthorized()
      }
      const { authorization } = httpRequest
      const payload = await this.tokenService.decode(authorization)
      if (!payload) {
        return unauthorized()
      }
      const { sub: userId } = payload
      const account = await this.guardianRepository.loadById(userId)
      if (!account) {
        return unauthorized()
      }
      const matchToken = await this.hashService.compare({ hash: account.accessToken ?? '', value: authorization })
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
    tokenService: TokenDecoder
    hashService: HashComparer
    guardianRepository: LoadGuardianByIdRepository
  }
}
