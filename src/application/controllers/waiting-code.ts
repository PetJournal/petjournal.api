import {
  type HttpRequest,
  type HttpResponse,
  badRequest,
  unauthorized,
  success,
  serverError
} from '@/application/helpers'
import { type Controller, type Validation } from '@/application/protocols'
import { type Logger } from '@/data/protocols'
import { type CreateAccessToken, type ValidateVerificationToken } from '@/domain/use-cases/'

export class WaitingCodeController implements Controller {
  private readonly validation: Validation
  private readonly validateVerificationToken: ValidateVerificationToken
  private readonly createAccessToken: CreateAccessToken
  private readonly logger: Logger

  constructor ({ validation, validateVerificationToken, createAccessToken, logger }: WaitingCodeController.Dependencies) {
    this.validation = validation
    this.validateVerificationToken = validateVerificationToken
    this.createAccessToken = createAccessToken
    this.logger = logger
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.logger.debug('httpRequest', { httpRequest })
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, verificationToken } = httpRequest.body
      const tokenIsValidOrError = await this.validateVerificationToken.validate({
        email,
        verificationToken
      })
      this.logger.debug('validateVerificationToken result', { tokenIsValidOrError })
      if (tokenIsValidOrError instanceof Error) {
        return unauthorized(tokenIsValidOrError)
      }
      const accessToken = await this.createAccessToken.create(email)
      this.logger.debug('createAccessToken result', { accessToken })
      return success({ accessToken })
    } catch (error) {
      const exception = error instanceof Error ? error : new Error(String(error))
      this.logger.error(exception.message, exception)
      return serverError(exception)
    }
  }
}

export namespace WaitingCodeController {
  export interface Dependencies {
    validation: Validation
    validateVerificationToken: ValidateVerificationToken
    createAccessToken: CreateAccessToken
    logger: Logger
  }
}
