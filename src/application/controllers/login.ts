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
import { type Logger } from '@/data/protocols'

export class LoginController implements Controller {
  private readonly validation: Validation
  private readonly authentication: Authentication
  private readonly logger: Logger

  constructor ({ validation, authentication, logger }: LoginController.Dependencies) {
    this.validation = validation
    this.authentication = authentication
    this.logger = logger
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.logger.debug('httpRequest', { httpRequest })
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body

      const result = await this.authentication.auth({
        email,
        sensitiveData: { field: 'password', value: password }
      })
      this.logger.debug('authentication result', { result })

      if (result instanceof Error) {
        return unauthorized(result)
      }

      return success({ accessToken: result })
    } catch (error) {
      const exception = error instanceof Error ? error : new Error(String(error))
      this.logger.error(exception.message, exception)
      return serverError(exception)
    }
  }
}

export namespace LoginController {
  export interface Dependencies {
    authentication: Authentication
    validation: Validation
    logger: Logger
  }
}
