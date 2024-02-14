import { type ChangePassword } from '@/domain/use-cases'
import { type Controller, type Validation } from '@/application/protocols'
import {
  type HttpRequest,
  type HttpResponse,
  success,
  serverError,
  badRequest
} from '@/application/helpers'

export class ChangePasswordController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly changePassword: ChangePassword
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requestForValidation = { ...httpRequest.body, userId: httpRequest.userId }
      const error = this.validation.validate(requestForValidation)

      if (error) {
        return badRequest(error)
      }

      const { userId } = httpRequest
      const { password } = httpRequest.body

      const response = await this.changePassword.change({
        id: userId as string,
        password
      })

      if (!response.isSuccess && response.error) {
        return badRequest(response.error)
      }

      return success({ message: 'Password reset completed successfully' })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
