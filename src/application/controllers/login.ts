import { type Authentication } from '@/domain/use-cases'
import { type Validation, type Controller } from '@/application/protocols'
import {
  type HttpRequest,
  type HttpResponse,
  badRequest,
  serverError,
  success,
  unauthorized
} from '@/application/helpers'

export class LoginController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body

      const result = await this.authentication.auth({
        email,
        sensitiveData: { field: 'password', value: password }
      })

      if (result instanceof Error) {
        return unauthorized(result)
      }

      return success({ accessToken: result })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
