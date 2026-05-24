import { type HttpRequest, type HttpResponse, success, serverError } from '@/application/helpers'
import { type Controller } from '@/application/protocols'
import { type LoadCatBreeds } from '@/domain/use-cases'

export class LoadCatBreedsController implements Controller {
  private readonly loadCatBreeds: LoadCatBreeds

  constructor ({ loadCatBreeds }: LoadCatBreedsController.Dependencies) {
    this.loadCatBreeds = loadCatBreeds
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const catBreeds = await this.loadCatBreeds.load()
      return success(catBreeds)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadCatBreedsController {
  export type Dependencies = {
    loadCatBreeds: LoadCatBreeds
  }
}
