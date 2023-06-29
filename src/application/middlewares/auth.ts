import { type Middleware } from '@/application/protocols'
import {
  type HashComparer,
  type TokenDecoder,
  type LoadGuardianByIdRepository
} from '@/data/protocols'
import {
  type HttpRequest,
  type HttpResponse,
  success,
  unauthorized,
  badRequest,
  serverError
} from '@/application/helpers'
import { InvalidTokenError, MissingParamError, NotFoundError } from '@/application/errors'

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
        return badRequest(new MissingParamError('authorization'))
      }

      let { authorization } = httpRequest
      if (authorization.startsWith(AuthMiddleware.BEARER_PREFIX)) {
        authorization = authorization.substring(7)
      }

      const payload = await this.tokenService.decode(authorization)
      if (!payload || !payload.sub) {
        return unauthorized(new InvalidTokenError('Invalid or expired token'))
      }

      const { sub: userId } = payload
      const account = await this.guardianRepository.loadById(userId)
      if (!account) {
        return unauthorized(new NotFoundError('User not found'))
      }

      const matchToken = await this.hashService.compare({ hash: account.accessToken ?? '', value: authorization })
      if (!matchToken) {
        return unauthorized(new InvalidTokenError('Invalid token for this user'))
      }

      return success({ userId })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace AuthMiddleware {
  export const BEARER_PREFIX = 'Bearer '
  export interface Dependencies {
    tokenService: TokenDecoder
    hashService: HashComparer
    guardianRepository: LoadGuardianByIdRepository
  }
}
