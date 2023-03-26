import { MissingParamError } from '../errors/missing-param-error'
import { type HttpRequest, type HttpResponse } from 'application/helpers/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.firstName) {
      return {
        statusCode: 400,
        body: new MissingParamError('firstName')
      }
    }
    if (!httpRequest.body.lastName) {
      return {
        statusCode: 400,
        body: new MissingParamError('lastName')
      }
    }
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email')
      }
    }
  }
}
