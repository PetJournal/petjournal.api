import { type SendEmail, type AddGuardian } from '@/domain/use-cases'
import { type Validation, type Controller } from '@/application/protocols'
import { ConflictGuardianError, EmailServiceError } from '@/application/errors'
import {
  type HttpRequest,
  type HttpResponse,
  conflict,
  serverError,
  create,
  createWithWarning,
  badRequest
} from '@/application/helpers'

export class SignUpController implements Controller {
  private readonly addGuardian: AddGuardian
  private readonly validation: Validation
  private readonly sendEmail: SendEmail

  constructor ({ addGuardian, validation, sendEmail }: SignUpController.Dependencies) {
    this.addGuardian = addGuardian
    this.sendEmail = sendEmail
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { firstName, lastName, email, phone, password } = httpRequest.body
      const image = httpRequest.file ?? null
      const guardian = await this.addGuardian.add({
        firstName,
        lastName,
        email,
        phone,
        password,
        verificationToken: '',
        image
      })

      if (!guardian) {
        return conflict(new ConflictGuardianError())
      }

      // Email is intentionally sent before returning the success response.
      // This ensures that if email delivery fails, the client receives a 201 with warning
      // rather than receiving a 201 success and silently missing the confirmation email.
      try {
        await this.sendEmail.send({
          id: guardian.id,
          firstName: guardian.firstName,
          lastName: guardian.lastName,
          email: guardian.email
        })
      } catch (error) {
        if (error instanceof EmailServiceError) {
          return createWithWarning(
            guardian,
            'email_failed',
            'O cadastro foi realizado com sucesso, mas ocorreu uma falha ao enviar o e-mail de confirmação.'
          )
        }
        throw error
      }

      return create(guardian)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace SignUpController {
  export interface Dependencies {
    addGuardian: AddGuardian
    sendEmail: SendEmail
    validation: Validation
  }
}
