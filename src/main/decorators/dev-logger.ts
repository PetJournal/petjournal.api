import { type HttpRequest, type HttpResponse } from '@/application/helpers'
import { type Controller } from '@/application/protocols'
import env from '../config/env'

export class DevLoggerControllerDecorator implements Controller {
  constructor (private readonly controller: Controller) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500 && env.nodeEnv.toLowerCase() === 'development') {
      console.error(httpResponse.body.stack)
    }
    return httpResponse
  }
}
