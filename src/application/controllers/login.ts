import { type Controller } from './controller'
import { badRequest, type HttpRequest, type HttpResponse } from '../helpers/http'
import { MissingParamError } from '../errors'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return badRequest(new MissingParamError('email'))
  }
}
