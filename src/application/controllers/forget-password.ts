import { type ForgetPassword } from '@/domain/use-cases'
import { type Controller, type Validation } from '@/application/protocols'
import { type HttpRequest, type HttpResponse, badRequest, success, serverError } from '@/application/helpers'
import { NotFoundError } from '@/application/errors'

export class ForgetPasswordController implements Controller {
  private readonly validation: Validation
  private readonly forgetPassword: ForgetPassword

  constructor ({ validation, forgetPassword }: ForgetPasswordController.Dependencies) {
    this.validation = validation
    this.forgetPassword = forgetPassword
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email } = httpRequest.body

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
    validation: Validation
    forgetPassword: ForgetPassword
  }
}
