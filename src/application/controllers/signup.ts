import { type HttpRequest, type HttpResponse } from 'application/helpers/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.firstName) {
      return {
        statusCode: 400,
        body: new Error('Missing param: firstName')
      }
    }
    if (!httpRequest.body.lastName) {
      return {
        statusCode: 400,
        body: new Error('Missing param: lastName')
      }
    }
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email')
      }
    }
  }
}
