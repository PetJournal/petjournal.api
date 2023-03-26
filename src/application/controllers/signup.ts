import { MissingParamError } from '../errors/missing-param-error'
import { badRequest, type HttpRequest, type HttpResponse } from '../helpers/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
