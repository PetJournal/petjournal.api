import { MissingParamError } from '../errors'
import { type HttpRequest, type HttpResponse, badRequest, success } from '../helpers/http'
import { type Controller } from './controller'

export class ForgetPasswordController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email } = httpRequest.body
    if (!email) {
      return badRequest(new MissingParamError('email'))
    }

    return success('')
  }
}
