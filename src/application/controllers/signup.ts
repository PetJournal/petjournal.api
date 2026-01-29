import { type SendEmail, type AddGuardian } from '@/domain/use-cases'
import { type Validation, type Controller } from '@/application/protocols'
import { ConflictGuardianError } from '@/application/errors'
import {
  type HttpRequest,
  type HttpResponse,
  conflict,
  serverError,
  create,
  badRequest
} from '@/application/helpers'
import { type Logger } from '@/data/protocols/log/logger'

export class SignUpController implements Controller {
  private readonly addGuardian: AddGuardian
  private readonly validation: Validation
  private readonly sendEmail: SendEmail
  private readonly logger: Logger

  constructor ({ addGuardian, validation, sendEmail, logger }: SignUpController.Dependencies) {
    this.addGuardian = addGuardian
    this.sendEmail = sendEmail
    this.validation = validation
    this.logger = logger
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { firstName, lastName, email, phone, password } = httpRequest.body
      const guardian = await this.addGuardian.add({
        firstName,
        lastName,
        email,
        phone,
        password,
        verificationToken: ''
      })

      if (!guardian) {
        return conflict(new ConflictGuardianError())
      }

      await this.sendEmail.send({ email: guardian.email })

      return create(guardian)
    } catch (error) {
      const exception = error instanceof Error ? error : new Error(String(error))
      this.logger.error(exception.message, exception)
      return serverError(exception)
    }
  }
}

export namespace SignUpController {
  export interface Dependencies {
    addGuardian: AddGuardian
    sendEmail: SendEmail
    validation: Validation
    logger: Logger
  }
}
