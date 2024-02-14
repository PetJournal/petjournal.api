import { success, type HttpRequest, type HttpResponse, serverError } from '@/application/helpers'
import { type Controller } from '@/application/protocols'
import { type LoadDogSizes } from '@/domain/use-cases/pet/size/load-dog-sizes'

export class LoadDogSizesController implements Controller {
  constructor (private readonly loadDogSizes: LoadDogSizes) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const dogSizes = await this.loadDogSizes.load()
      return success(dogSizes)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
