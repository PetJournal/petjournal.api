import { LoadPetByIdController } from '@/application/controllers'
import { type HttpRequest } from '@/application/helpers'
import { type LoadPetById } from '@/domain/use-cases'
import { makeFakeLoadPetByIdUseCase, makeFakeServerError } from '@/tests/utils'

interface SutTypes {
  sut: LoadPetByIdController
  loadPetByIdStub: LoadPetById
}

const makeSut = (): SutTypes => {
  const loadPetByIdStub = makeFakeLoadPetByIdUseCase()
  const dependencies: LoadPetByIdController.Dependencies = {
    loadPet: loadPetByIdStub
  }
  const sut = new LoadPetByIdController(dependencies)
  return {
    sut,
    loadPetByIdStub
  }
}

describe('Load pet by id Controller', () => {
  const httpRequest: HttpRequest = {
    params: {
      petId: 'any_pet_id'
    }
  }

  it('Should returns 500 (ServerError) if loadPetById throws', async () => {
    const { sut, loadPetByIdStub } = makeSut()
    jest.spyOn(loadPetByIdStub, 'loadById').mockRejectedValue(new Error())
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(makeFakeServerError())
  })

  it('Should call LoadById with correct value', async () => {
    const { sut, loadPetByIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadPetByIdStub, 'loadById')
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith(httpRequest.params)
  })
})
