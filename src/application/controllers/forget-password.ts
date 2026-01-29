import { type ForgetPassword } from '@/domain/use-cases'
import { type Controller, type Validation } from '@/application/protocols'
import { type HttpRequest, type HttpResponse, badRequest, success, serverError } from '@/application/helpers'
import { NotFoundError } from '@/application/errors'
import { type Logger } from '@/data/protocols'

export class ForgetPasswordController implements Controller {
  private readonly validation: Validation
  private readonly forgetPassword: ForgetPassword
  private readonly logger: Logger

  constructor ({ validation, forgetPassword, logger }: ForgetPasswordController.Dependencies) {
    this.validation = validation
    this.forgetPassword = forgetPassword
    this.logger = logger
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
      const exception = error instanceof Error ? error : new Error(String(error))
      this.logger.error(exception.message, exception)
      return serverError(exception)
    }
  }
}

export namespace ForgetPasswordController {
  export interface Dependencies {
    validation: Validation
    forgetPassword: ForgetPassword
    logger: Logger
  }
}
