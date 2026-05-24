import { LoadNextTasksByPetIdController } from '@/application/controllers'
import { InvalidParamError, NotFoundError } from '@/application/errors'
import { success, serverError, badRequest } from '@/application/helpers'
import { type Validation } from '@/application/protocols'
import { type LoadNextTasksByPetId } from '@/domain/use-cases'
import { makeFakeValidation } from '@/tests/utils'

const makeUseCaseStub = (): LoadNextTasksByPetId => ({
  load: jest.fn().mockResolvedValue({
    isSuccess: true,
    data: {
      page: 1,
      limit: 10,
      totalPages: 1,
      nextEvents: [
        { id: 'task1' },
        { id: 'task2' }
      ]
    }
  })
})

interface SutTypes {
  sut: LoadNextTasksByPetIdController
  validationStub: Validation
  useCaseStub: LoadNextTasksByPetId
}

const makeSut = (): SutTypes => {
  const validationStub = makeFakeValidation()
  const useCaseStub = makeUseCaseStub()

  const sut = new LoadNextTasksByPetIdController(
    useCaseStub,
    validationStub
  )

  return {
    sut,
    validationStub,
    useCaseStub
  }
}

describe('LoadNextTasksByPetIdController', () => {
  it('Should call validation with correct data', async () => {
    const { sut, validationStub } = makeSut()
    const spy = jest.spyOn(validationStub, 'validate')

    await sut.handle({
      params: { petId: 'pet_1' },
      query: { page: 2, limit: 5 }
    })

    expect(spy).toHaveBeenCalledWith({
      petId: 'pet_1',
      page: 2,
      limit: 5
    })
  })

  it('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new InvalidParamError('petId'))

    const response = await sut.handle({
      params: { petId: 'invalid' },
      query: {}
    })

    expect(response).toEqual(
      badRequest(new InvalidParamError('petId'))
    )
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

  it('Should return 400 if use-case returns domain error', async () => {
    const { sut, useCaseStub } = makeSut()
    jest.spyOn(useCaseStub, 'load').mockResolvedValueOnce({
      isSuccess: false,
      error: new NotFoundError('petId')
    })

    const response = await sut.handle({
      params: { petId: 'invalid_pet' },
      query: {}
    })

    expect(response).toEqual(
      badRequest(new NotFoundError('petId'))
    )
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

  it('Should return 200 with next events on success', async () => {
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
        nextEvents: [
          { id: 'task1' },
          { id: 'task2' }
        ]
      })
    )
  })
})
