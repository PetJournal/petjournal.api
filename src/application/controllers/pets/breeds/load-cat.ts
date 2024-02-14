import { type HttpRequest, type HttpResponse, success, serverError } from '@/application/helpers'
import { type Controller } from '@/application/protocols'
import { type LoadCatBreeds } from '@/domain/use-cases'

export class LoadCatBreedsController implements Controller {
  constructor (private readonly loadCatBreeds: LoadCatBreeds) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const catBreeds = await this.loadCatBreeds.load()
      return success(catBreeds)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
