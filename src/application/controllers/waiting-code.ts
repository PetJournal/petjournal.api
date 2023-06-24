import { type Authentication } from '@/domain/use-cases'
import { type Controller, type Validation } from '@/application/protocols'
import {
  type HttpRequest,
  type HttpResponse,
  badRequest,
  unauthorized,
  success,
  serverError
} from '@/application/helpers/http'

export class WaitingCodeController implements Controller {
  private readonly validation: Validation
  private readonly authentication: Authentication

  constructor ({ validation, authentication }: WaitingCodeController.Dependencies) {
    this.authentication = authentication
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, forgetPasswordCode } = httpRequest.body

      const result = await this.authentication.auth({
        email,
        sensitiveData: { field: 'forgetPasswordCode', value: forgetPasswordCode }
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

namespace WaitingCodeController {
  export interface Dependencies {
    authentication: Authentication
    validation: Validation
  }
}
