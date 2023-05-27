import { type Controller } from '@/application/protocols'
import { type HttpRequest, type HttpResponse } from '@/application/helpers'
import { type LoggerErrorRepository } from '@/data/protocols'

export class LoggerControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly loggerErrorRepository: LoggerErrorRepository

  constructor (controller: Controller, loggerErrorRepository: LoggerErrorRepository) {
    this.controller = controller
    this.loggerErrorRepository = loggerErrorRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.loggerErrorRepository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
