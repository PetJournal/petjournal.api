import { LoadPetByIdController } from '@/application/controllers'
import { NotFoundError } from '@/application/errors'
import { badRequest, success, type HttpRequest } from '@/application/helpers'
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

  it('Should return 400 (BadRequest) if invalid petId is provided', async () => {
    const { sut, loadPetByIdStub } = makeSut()
    jest.spyOn(loadPetByIdStub, 'loadById').mockResolvedValue({
      isSuccess: false,
      error: new NotFoundError('petId')
    })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new NotFoundError('petId')))
  })

  it('Should return a pet on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(success({
      id: expect.any(String),
      guardianId: expect.any(String),
      specie: {
        id: expect.any(String),
        name: 'any_name'
      },
      specieAlias: '',
      petName: 'any_pet_name',
      gender: 'any_pet_gender',
      breedAlias: '',
      breed: {
        id: 'any_id',
        name: 'any_name'
      },
      size: {
        id: 'any_id',
        name: 'any_name'
      },
      castrated: false,
      dateOfBirth: new Date(2000, 10, 23),
      image: 'any_image_url'
    }))
  })
})
