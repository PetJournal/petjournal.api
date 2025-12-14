import { LoadNextTaskByPetIdAndTagIdController } from '@/application/controllers'
import { NotFoundError } from '@/application/errors'
import { badRequest, type HttpRequest } from '@/application/helpers'
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
    },
    query: {
      page: 1,
      limit: 10
    }
  }

  it('Should return 500 (ServerError) if load throws', async () => {
    const { sut, loadNextTasksByPetIdAndTagIdStub } = makeSut()
    jest.spyOn(loadNextTasksByPetIdAndTagIdStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(makeFakeServerError())
  })

  it('Should call load with correct values', async () => {
    const { sut, loadNextTasksByPetIdAndTagIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadNextTasksByPetIdAndTagIdStub, 'load')
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith({ ...httpRequest.params, ...httpRequest.query })
  })

  it('Should return 400(BadRequest) if an invlalid petId is provided', async () => {
    const { sut, loadNextTasksByPetIdAndTagIdStub } = makeSut()
    jest.spyOn(loadNextTasksByPetIdAndTagIdStub, 'load').mockResolvedValue({
      isSuccess: false,
      error: new NotFoundError('petId')
    })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new NotFoundError('petId')))
  })
})
