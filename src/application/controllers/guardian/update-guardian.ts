import { badRequest, notAcceptable, serverError, success, type HttpRequest, type HttpResponse } from '@/application/helpers'
import { type Controller, type Validation } from '@/application/protocols'
import { type UpdateGuardian } from '@/domain/use-cases'

export class UpdateGuardianController implements Controller {
  private readonly validation: Validation
  private readonly updateGuardian: UpdateGuardian

  constructor ({ validation, updateGuardian }: UpdateGuardianController.Dependencies) {
    this.validation = validation
    this.updateGuardian = updateGuardian
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate({ ...httpRequest.body, ...httpRequest.params })
      if (error) {
        return badRequest(error)
      }
      const { guardianId } = httpRequest.params
      const image = httpRequest.file ?? null
      const updateData = { ...httpRequest.body, guardianId, image }
      const result = await this.updateGuardian.update(updateData)
      if (!result.isSuccess) {
        return notAcceptable(result.error as Error)
      }
      return success({
        id: result.data?.id,
        firstName: result.data?.firstName,
        lastName: result.data?.lastName,
        phone: result.data?.phone,
        image: result.data?.image
      })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace UpdateGuardianController {
  export interface Dependencies {
    validation: Validation
    updateGuardian: UpdateGuardian
  }
}
