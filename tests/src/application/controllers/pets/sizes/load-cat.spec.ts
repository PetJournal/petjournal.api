import { LoadCatSizesController } from '@/application/controllers/pets/sizes/load-cat'
import { success } from '@/application/helpers'
import { type LoadCatSizes } from '@/domain/use-cases/pet/size/load-cat-sizes'
import { makeFakeLoadCatSizesUseCase, makeFakeServerError } from '@/tests/utils'

interface SutTypes {
  sut: LoadCatSizesController
  loadCatSizesStub: LoadCatSizes
}

const makeSut = (): SutTypes => {
  const loadCatSizesStub = makeFakeLoadCatSizesUseCase()
  const dependencies: LoadCatSizesController.Dependencies = {
    loadCatSizes: loadCatSizesStub
  }
  const sut = new LoadCatSizesController(dependencies)
  return {
    sut,
    loadCatSizesStub
  }
}

describe('LoadCatSizes Controller', () => {
  it('Should returns 500 (serverError) if loadCatSizes throws', async () => {
    const { sut, loadCatSizesStub } = makeSut()
    jest.spyOn(loadCatSizesStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(makeFakeServerError())
  })

  it('Should return a list of sizes on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(success([{ name: 'any_name' }]))
  })
})
