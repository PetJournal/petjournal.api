import { type HttpRequest, type HttpResponse, badRequest } from '@/application/helpers'
import { type Controller, type Validation } from '@/application/protocols'

export class PetRegistryController implements Controller {
  private readonly validation: Validation

  constructor ({ validation }: PetRegistryController.Dependencies) {
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return badRequest(error)
    }
    return badRequest(new Error())
  }
}

export namespace PetRegistryController {
  export interface Dependencies {
    validation: Validation
  }
}
