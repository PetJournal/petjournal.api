import { MissingParamError } from '../errors/missing-param-error'
import { badRequest, type HttpRequest, type HttpResponse } from '../helpers/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.firstName) {
      return badRequest(new MissingParamError('firstName'))
    }
    if (!httpRequest.body.lastName) {
      return badRequest(new MissingParamError('lastName'))
    }
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }
  }
}
