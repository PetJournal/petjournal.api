import { type LoadGuardian } from '@/domain/use-cases'
import { success, type HttpRequest, type HttpResponse, serverError } from '@/application/helpers'
import { type Controller } from '@/application/protocols'

export class LoadGuardianController implements Controller {
  private readonly loadGuardian: LoadGuardian

  constructor ({ loadGuardian }: LoadGuardianController.Dependencies) {
    this.loadGuardian = loadGuardian
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const guardianName = await this.loadGuardian.load(httpRequest.userId as string)
      return success(guardianName)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadGuardianController {
  export interface Dependencies {
    loadGuardian: LoadGuardian
  }
}
