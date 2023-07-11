import { type GetGuardianName } from '@/domain/use-cases'
import { success, type HttpRequest, type HttpResponse, serverError } from '../helpers'
import { type Controller } from '../protocols'

export class LoadGuardianNameController implements Controller {
  private readonly getGuardianName: GetGuardianName

  constructor ({ getGuardianName }: LoadGuardianNameController.Dependencies) {
    this.getGuardianName = getGuardianName
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (httpRequest.userId) {
        await this.getGuardianName.load(httpRequest.userId)
      }
      return success('')
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadGuardianNameController {
  export interface Dependencies {
    getGuardianName: GetGuardianName
  }
}
