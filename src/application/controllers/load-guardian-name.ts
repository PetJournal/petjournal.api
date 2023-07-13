import { type GetGuardianName } from '@/domain/use-cases'
import { success, type HttpRequest, type HttpResponse, serverError } from '@/application/helpers'
import { type Controller } from '@/application/protocols'

export class LoadGuardianNameController implements Controller {
  private readonly getGuardianName: GetGuardianName

  constructor ({ getGuardianName }: LoadGuardianNameController.Dependencies) {
    this.getGuardianName = getGuardianName
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const guardianName = await this.getGuardianName.load(httpRequest.userId as string)
      return success(guardianName)
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
