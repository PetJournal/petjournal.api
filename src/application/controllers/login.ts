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
  private readonly validation: Validation
  private readonly authentication: Authentication

  constructor ({ validation, authentication }: LoginController.Dependencies) {
    this.validation = validation
    this.authentication = authentication
  }

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

export namespace LoginController {
  export interface Dependencies {
    authentication: Authentication
    validation: Validation
  }
}
