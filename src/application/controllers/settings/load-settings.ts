import { type HttpRequest, type HttpResponse, serverError, success } from '@/application/helpers'
import { type Controller } from '@/application/protocols'
import { type LoadSettings } from '@/domain/use-cases/settings'

export class LoadSettingsController implements Controller {
  private readonly loadSettings: LoadSettings

  constructor ({ loadSettings }: LoadSettingsController.Dependencies) {
    this.loadSettings = loadSettings
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const guardianId = httpRequest.userId as string
      const result = await this.loadSettings.loadAll(guardianId)
      return success(result)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadSettingsController {
  export type Dependencies = {
    loadSettings: LoadSettings
  }
}
