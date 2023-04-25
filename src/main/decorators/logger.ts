import { type Controller } from '@/application/controllers/controller'
import { type HttpRequest, type HttpResponse } from '@/application/helpers/http'

export class LoggerControllerDecorator implements Controller {
  private readonly controller: Controller

  constructor (controller: Controller) {
    this.controller = controller
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await this.controller.handle(httpRequest)
  }
}
