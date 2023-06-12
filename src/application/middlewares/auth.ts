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
        return badRequest(new MissingParamError('authorization'))
      }

      let { authorization } = httpRequest
      if (authorization.startsWith(AuthMiddleware.BEARER_PREFIX)) {
        authorization = authorization.substring(7)
      }

      const payload = await this.tokenDecoder.decode(authorization)
      if (!payload) {
        return unauthorized(new InvalidTokenError('Invalid or expired token'))
      }

      const { sub: userId } = payload
      const account = await this.loadGuardianById.loadById(userId)
      if (!account) {
        return unauthorized(new NotFoundError('User not found'))
      }

      const matchToken = await this.hashComparer.compare({
        hash: account.accessToken ?? '',
        value: authorization
      })
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
    tokenDecoder: TokenDecoder
    hashComparer: HashComparer
    loadGuardianById: LoadGuardianByIdRepository
  }
}
