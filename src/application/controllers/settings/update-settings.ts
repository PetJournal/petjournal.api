import { badRequest, notAcceptable, serverError, success, type HttpRequest, type HttpResponse } from '@/application/helpers'
import { type Validation, type Controller } from '@/application/protocols'
import { type UpdateSettings } from '@/domain/use-cases'

export class UpdateSettingsController implements Controller {
  private readonly updateSettings: UpdateSettings
  private readonly validation: Validation

  constructor ({ updateSettings, validation }: UpdateSettingsController.Dependencies) {
    this.updateSettings = updateSettings
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const guardianId = httpRequest.userId
      const updateData = { ...httpRequest.body, guardianId }
      const result = await this.updateSettings.update(updateData)
      if (!result.isSuccess) {
        return notAcceptable(result.error)
      }
      return success({
        guardianId: result.data?.guardianId,
        notificationEmail: result.data?.notificationEmail,
        notificationMobile: result.data?.notificationMobile
      })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace UpdateSettingsController {
  export type Dependencies = {
    validation: Validation
    updateSettings: UpdateSettings
  }

}
