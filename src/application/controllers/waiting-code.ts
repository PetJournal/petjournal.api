import { type Controller } from '@/application/controllers/controller'
import { type HttpRequest, type HttpResponse, badRequest } from '@/application/helpers/http'
import { MissingParamError } from '@/application/errors'

export class WaitingCodeController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return badRequest(new MissingParamError('email'))
  }
}
