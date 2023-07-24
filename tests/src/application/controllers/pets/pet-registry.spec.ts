import { type HttpRequest, type HttpResponse, badRequest } from '@/application/helpers'
import { type Controller, type Validation } from '@/application/protocols'
import { makeFakePetRegistryRequest, makeFakeValidation } from '@/tests/utils'

export class PetRegistryController implements Controller {
  private readonly validation: Validation

  constructor ({ validation }: PetRegistryController.Dependencies) {
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return badRequest(new Error())
  }
}

export namespace PetRegistryController {
  export interface Dependencies {
    validation: Validation
  }
}

interface SutTypes {
  sut: PetRegistryController
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeFakeValidation()
  const dependencies: PetRegistryController.Dependencies = {
    validation: validationStub
  }
  const sut = new PetRegistryController(dependencies)
  return { sut, validationStub }
}

describe('PetRegistry Controller', () => {
  const httpRequest = makeFakePetRegistryRequest()
  describe('Validation', () => {
    it('Should return 400 (BadRequest) if Validation returns an error', async () => {
      const { sut, validationStub } = makeSut()
      jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new Error()))
    })
  })
})
