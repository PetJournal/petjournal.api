import { type Controller } from './controller'
import { badRequest, type HttpRequest, type HttpResponse } from '../helpers/http'
import { MissingParamError } from '../errors'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return await new Promise(resolve => { resolve(badRequest(new MissingParamError('email'))) })
    }
    if (!httpRequest.body.password) {
      return await new Promise(resolve => { resolve(badRequest(new MissingParamError('password'))) })
    }
    return await new Promise(resolve => { resolve(badRequest(new MissingParamError('email or password'))) })
  }
}
