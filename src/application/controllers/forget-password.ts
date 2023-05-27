import { type ForgetPassword } from '@/domain/use-cases'
import { type Controller } from '@/application/protocols'
import { type EmailValidator } from '@/application/validation'
import { type HttpRequest, type HttpResponse, badRequest, success, serverError } from '@/application/helpers'
import { InvalidParamError, MissingParamError, NotFoundError } from '@/application/errors'

export class ForgetPasswordController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly forgetPassword: ForgetPassword

  constructor ({ emailValidator, forgetPassword }: ForgetPasswordController.Dependencies) {
    this.emailValidator = emailValidator
    this.forgetPassword = forgetPassword
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email } = httpRequest.body
      if (!email) {
        return badRequest(new MissingParamError('email'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const isSuccess = await this.forgetPassword.forgetPassword({ email })
      if (!isSuccess) {
        return badRequest(new NotFoundError('email'))
      }

      return success({ message: 'Email sent successfully' })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace ForgetPasswordController {
  export interface Dependencies {
    emailValidator: EmailValidator
    forgetPassword: ForgetPassword
  }
}
