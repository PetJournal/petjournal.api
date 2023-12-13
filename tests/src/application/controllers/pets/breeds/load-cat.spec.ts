import { LoadCatBreedsController } from '@/application/controllers/pets/breeds'
import { success } from '@/application/helpers'
import { type LoadCatBreeds } from '@/domain/use-cases'
import { makeFakeServerError, makeLoadCatBreedsUseCase } from '@/tests/utils'

interface SutTypes {
  sut: LoadCatBreedsController
  loadCatBreedsStub: LoadCatBreeds
}

const makeSut = (): SutTypes => {
  const loadCatBreedsStub = makeLoadCatBreedsUseCase()
  const dependencies: LoadCatBreedsController.Dependencies = {
    loadCatBreeds: loadCatBreedsStub
  }
  const sut = new LoadCatBreedsController(dependencies)
  return {
    sut,
    loadCatBreedsStub
  }
}

describe('LoadCatBreeds Controller', () => {
  test('should returns 500 (ServerError) if loadCatBreeds throws', async () => {
    const { sut, loadCatBreedsStub } = makeSut()
    jest.spyOn(loadCatBreedsStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(makeFakeServerError())
  })

  test('should return a list of breeds on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(success([{ name: 'any_name' }]))
  })
})
