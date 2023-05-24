import { type Controller } from '@/application/controllers/controller'
import { type HttpRequest, type HttpResponse, badRequest, serverError } from '@/application/helpers/http'
import { MissingParamError } from '@/application/errors'

export class WaitingCodeController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'forgetPasswordCode']
    for (const field of requiredFields) {
      if (httpRequest.body[field] === undefined) {
        return badRequest(new MissingParamError(field))
      }
    }
    return serverError(new Error())
  }
}
