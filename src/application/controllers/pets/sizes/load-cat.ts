import { success, type HttpRequest, type HttpResponse, serverError } from '@/application/helpers'
import { type Controller } from '@/application/protocols'
import { type LoadCatSizes } from '@/domain/use-cases/pet/size/load-cat-sizes'

export class LoadCatSizesController implements Controller {
  private readonly loadCatSizes: LoadCatSizes

  constructor ({ loadCatSizes }: LoadCatSizesController.Dependencies) {
    this.loadCatSizes = loadCatSizes
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const catSizes = await this.loadCatSizes.load()
      return success(catSizes)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadCatSizesController {
  export type Dependencies = {
    loadCatSizes: LoadCatSizes
  }
}
