import { LoadNextTaskByPetIdAndTagIdController } from '@/application/controllers'
import { type HttpRequest } from '@/application/helpers'
import { type LoadNextTasksByPetIdAndTagId } from '@/domain/use-cases'
import { makeFakeLoadNextTasksByPetIdAndTagIdUseCase, makeFakeServerError, makeFakeValidation } from '@/tests/utils'

interface SutTypes {
  sut: LoadNextTaskByPetIdAndTagIdController
  loadNextTasksByPetIdAndTagIdStub: LoadNextTasksByPetIdAndTagId
}

const makeSut = (): SutTypes => {
  const loadNextTasksByPetIdAndTagIdStub = makeFakeLoadNextTasksByPetIdAndTagIdUseCase()
  const validationStub = makeFakeValidation()
  const dependencies: LoadNextTaskByPetIdAndTagIdController.Dependencies = {
    loadNextTasksByPetIdAndTagId: loadNextTasksByPetIdAndTagIdStub,
    validation: validationStub
  }
  const sut = new LoadNextTaskByPetIdAndTagIdController(dependencies)
  return {
    sut,
    loadNextTasksByPetIdAndTagIdStub
  }
}

describe('LoadNextTasksByPetIdAndTagId Controller', () => {
  const httpRequest: HttpRequest = {
    params: {
      petId: 'any_id',
      tagId: 'any_id'
    }
  }

  it('Should return 500 (ServerError) if load throws', async () => {
    const { sut, loadNextTasksByPetIdAndTagIdStub } = makeSut()
    jest.spyOn(loadNextTasksByPetIdAndTagIdStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(makeFakeServerError())
  })
})
