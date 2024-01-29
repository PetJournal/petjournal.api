import { LoadDogBreedsController } from '@/application/controllers/pets/breeds'
import { success } from '@/application/helpers'
import { type LoadDogBreeds } from '@/domain/use-cases'
import { makeFakeServerError, makeLoadDogBreedsUseCase } from '@/tests/utils'

interface SutTypes {
  sut: LoadDogBreedsController
  loadDogBreedsStub: LoadDogBreeds
}

const makeSut = (): SutTypes => {
  const loadDogBreedsStub = makeLoadDogBreedsUseCase()
  const dependencies: LoadDogBreedsController.Dependencies = {
    loadDogBreeds: loadDogBreedsStub
  }
  const sut = new LoadDogBreedsController(dependencies)
  return {
    sut,
    loadDogBreedsStub
  }
}

describe('LoadDogBreeds Controller', () => {
  it('Should returns 500 (ServerError) if loadDogBreeds throws', async () => {
    const { sut, loadDogBreedsStub } = makeSut()
    jest.spyOn(loadDogBreedsStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(makeFakeServerError())
  })

  it('Should return a list of breeds on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(success([{ name: 'any_name' }]))
  })
})
