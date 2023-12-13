import { type HttpRequest, type HttpResponse, success, serverError } from '@/application/helpers'
import { type Controller } from '@/application/protocols'
import { type LoadDogBreeds } from '@/domain/use-cases'

export class LoadDogBreedsController implements Controller {
  private readonly loadDogBreeds: LoadDogBreeds

  constructor ({ loadDogBreeds }: LoadDogBreedsController.Dependencies) {
    this.loadDogBreeds = loadDogBreeds
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const dogBreeds = await this.loadDogBreeds.load()
      return success(dogBreeds)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadDogBreedsController {
  export type Dependencies = {
    loadDogBreeds: LoadDogBreeds
  }
}
