import { type LoadGuardianName } from '@/domain/use-cases'
import { success, type HttpRequest, type HttpResponse, serverError } from '@/application/helpers'
import { type Controller } from '@/application/protocols'

export class LoadGuardianNameController implements Controller {
  private readonly loadGuardianName: LoadGuardianName

  constructor ({ loadGuardianName }: LoadGuardianNameController.Dependencies) {
    this.loadGuardianName = loadGuardianName
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const guardianName = await this.loadGuardianName.load(httpRequest.userId as string)
      return success(guardianName)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadGuardianNameController {
  export interface Dependencies {
    loadGuardianName: LoadGuardianName
  }
}
