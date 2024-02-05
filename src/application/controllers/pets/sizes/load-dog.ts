import { success, type HttpRequest, type HttpResponse, serverError } from '@/application/helpers'
import { type Controller } from '@/application/protocols'
import { type LoadDogSizes } from '@/domain/use-cases/pet/size/load-dog-sizes'

export class LoadDogSizesController implements Controller {
  private readonly loadDogSizes: LoadDogSizes

  constructor ({ loadDogSizes }: LoadDogSizesController.Dependencies) {
    this.loadDogSizes = loadDogSizes
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const dogSizes = await this.loadDogSizes.load()
      return success(dogSizes)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadDogSizesController {
  export type Dependencies = {
    loadDogSizes: LoadDogSizes
  }
}
