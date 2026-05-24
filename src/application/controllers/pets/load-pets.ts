import { serverError, success, type HttpRequest, type HttpResponse } from '@/application/helpers'
import { type Controller } from '@/application/protocols'
import { type LoadPets } from '@/domain/use-cases'

export class LoadPetsController implements Controller {
  private readonly loadPets: LoadPets

  constructor ({ loadPets }: LoadPetsController.Dependencies) {
    this.loadPets = loadPets
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const guardianId = httpRequest.userId as string
      const result = await this.loadPets.load({ guardianId })
      return success(result)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadPetsController {
  export type Dependencies = {
    loadPets: LoadPets
  }
}
