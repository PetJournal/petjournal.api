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
      // This ensures that if email delivery fails, the client receives a 500
      // error and can retry — rather than receiving a 201 and later discovering
      // the confirmation email was never sent.
      await this.sendEmail.send({
        id: guardian.id,
        firstName: guardian.firstName,
        lastName: guardian.lastName,
        email: guardian.email
      })

      return create(guardian)
    } catch (error) {
      console.error('SignUp error:', error)
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
