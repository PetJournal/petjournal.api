import { LoadDogSizesController } from '@/application/controllers/pets/sizes/load-dog'
import { success } from '@/application/helpers'
import { type LoadDogSizes } from '@/domain/use-cases/pet/size/load-dog-sizes'
import { makeFakeLoadDogSizesUSeCase, makeFakeServerError } from '@/tests/utils'

interface SutTypes {
  sut: LoadDogSizesController
  loadDogSizesStub: LoadDogSizes
}

const makeSut = (): SutTypes => {
  const loadDogSizesStub = makeFakeLoadDogSizesUSeCase()
  const dependencies: LoadDogSizesController.Dependencies = {
    loadDogSizes: loadDogSizesStub
  }
  const sut = new LoadDogSizesController(dependencies)
  return {
    sut,
    loadDogSizesStub
  }
}

describe('LoadDogSizes Controller', () => {
  it('Should return 500 (serverError) if loadDogSizes throws', async () => {
    const { sut, loadDogSizesStub } = makeSut()
    jest.spyOn(loadDogSizesStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(makeFakeServerError())
  })

  it('Should return a list of sizes on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(success([{ name: 'any_name' }]))
  })
})
