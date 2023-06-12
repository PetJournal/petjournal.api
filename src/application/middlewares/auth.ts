import { type Middleware } from '@/application/protocols'
import { type HashComparer, type TokenDecoder, type LoadGuardianByIdRepository } from '@/data/protocols'
import { serverError, type HttpRequest, type HttpResponse, unauthorized, success } from '@/application/helpers'

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
      let { authorization } = httpRequest
      if (authorization.startsWith('Bearer ')) {
        authorization = authorization.substring(7)
      }
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
