import { type LoadGuardianName } from '@/domain/use-cases'
import { success, type HttpRequest, type HttpResponse, serverError } from '@/application/helpers'
import { type Controller } from '@/application/protocols'
import { type Logger } from '@/data/protocols'

export class LoadGuardianNameController implements Controller {
  private readonly loadGuardianName: LoadGuardianName
  private readonly logger: Logger

  constructor ({ loadGuardianName, logger }: LoadGuardianNameController.Dependencies) {
    this.loadGuardianName = loadGuardianName
    this.logger = logger
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.logger.debug('httpRequest', { httpRequest })
      const guardianName = await this.loadGuardianName.load(httpRequest.userId as string)
      return success(guardianName)
    } catch (error) {
      const exception = error instanceof Error ? error : new Error(String(error))
      this.logger.error(exception.message, exception)
      return serverError(exception)
    }
  }
}

export namespace LoadGuardianNameController {
  export interface Dependencies {
    loadGuardianName: LoadGuardianName
    logger: Logger
  }
}
