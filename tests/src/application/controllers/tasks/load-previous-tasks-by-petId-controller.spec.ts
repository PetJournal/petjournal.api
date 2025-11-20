import { LoadPreviousTasksByPetIdController } from '@/application/controllers'
import { InvalidParamError } from '@/application/errors'
import { success, serverError, badRequest } from '@/application/helpers'
import { type Validation } from '@/application/protocols'
import { type LoadPreviousTasksByPetId } from '@/domain/use-cases'
import { makeFakeValidation } from '@/tests/utils'

const makeUseCaseStub = (): LoadPreviousTasksByPetId => ({
  load: jest.fn().mockResolvedValue({
    page: 1,
    limit: 10,
    totalPages: 1,
    history: [
      { id: 'past1' },
      { id: 'past2' }
    ]
  })
})

interface SutTypes {
  sut: LoadPreviousTasksByPetIdController
  validationStub: Validation
  useCaseStub: LoadPreviousTasksByPetId
}

const makeSut = (): SutTypes => {
  const validationStub = makeFakeValidation()
  const useCaseStub = makeUseCaseStub()
  const sut = new LoadPreviousTasksByPetIdController({ loadPreviousTasksByPetId: useCaseStub, validation: validationStub })
  return {
    sut,
    validationStub,
    useCaseStub
  }
}

describe('LoadPreviousTasksByPetIdController', () => {
  it('Should call validation with correct data', async () => {
    const { sut, validationStub } = makeSut()
    const spy = jest.spyOn(validationStub, 'validate')

    await sut.handle({
      params: { petId: 'pet_1' },
      query: { page: 2, limit: 5 }
    })

    expect(spy).toHaveBeenCalledWith({ petId: 'pet_1', page: 2, limit: 5 })
  })

  it('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new InvalidParamError('petId'))

    const response = await sut.handle({
      params: { petId: 'invalid' },
      query: {}
    })

    expect(response).toEqual(badRequest(new InvalidParamError('petId')))
  })

  it('Should call use case with correct values', async () => {
    const { sut, useCaseStub } = makeSut()
    const spy = jest.spyOn(useCaseStub, 'load')

    await sut.handle({
      params: { petId: 'pet_1' },
      query: { page: 3, limit: 20 }
    })

    expect(spy).toHaveBeenCalledWith({
      petId: 'pet_1',
      page: 3,
      limit: 20
    })
  })

  it('Should return 500 if use-case throws', async () => {
    const { sut, useCaseStub } = makeSut()
    jest.spyOn(useCaseStub, 'load').mockRejectedValueOnce(new Error())

    const response = await sut.handle({
      params: { petId: 'pet_1' },
      query: {}
    })

    expect(response).toEqual(serverError(new Error()))
  })

  it('Should return 200 with history on success', async () => {
    const { sut } = makeSut()

    const response = await sut.handle({
      params: { petId: 'pet_1' },
      query: { page: 1, limit: 10 }
    })

    expect(response).toEqual(
      success({
        page: 1,
        limit: 10,
        totalPages: 1,
        history: [
          { id: 'past1' },
          { id: 'past2' }
        ]
      })
    )
  })
})
