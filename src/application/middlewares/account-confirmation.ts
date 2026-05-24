import { type LoadGuardianByEmailRepository, type LoadGuardianByIdRepository } from '@/data/protocols'
import { EmailConfirmationError, NotFoundError } from '../errors'
import { noContent, serverError, unauthorized, type HttpRequest, type HttpResponse } from '../helpers'
import { type Middleware } from '../protocols'

export class AccountConfirmationMiddleware implements Middleware {
  private readonly guardianRepository: LoadGuardianByEmailRepository & LoadGuardianByIdRepository

  constructor ({ guardianRepository }: AccountConfirmationMiddleware.Dependencies) {
    this.guardianRepository = guardianRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      let guardian
      const { userId, body: { email } } = httpRequest

      if (userId) {
        guardian = await this.guardianRepository.loadById(userId)
      } else {
        guardian = await this.guardianRepository.loadByEmail(email)
      }

      if (!guardian) {
        return unauthorized(new NotFoundError('User not found'))
      }

      if (!guardian.emailConfirmation) {
        return unauthorized(new EmailConfirmationError('your email are not confirmed'))
      }

      return noContent()
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace AccountConfirmationMiddleware {
  export interface Dependencies {
    guardianRepository: LoadGuardianByEmailRepository & LoadGuardianByIdRepository
  }
}
