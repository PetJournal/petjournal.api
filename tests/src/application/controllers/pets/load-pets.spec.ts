import { LoadPetsController } from '@/application/controllers'
import { type HttpRequest, success } from '@/application/helpers'
import { type LoadPets } from '@/domain/use-cases'
import { makeFakeLoadPetsUseCase, makeFakeServerError } from '@/tests/utils'

interface SutTypes {
  sut: LoadPetsController
  loadPetsStub: LoadPets
}

const makeSut = (): SutTypes => {
  const loadPetsStub = makeFakeLoadPetsUseCase()
  const dependencies: LoadPetsController.Dependencies = {
    loadPets: loadPetsStub
  }
  const sut = new LoadPetsController(dependencies)
  return {
    sut,
    loadPetsStub
  }
}

describe('LoadPets Controller', () => {
  const fakeHttpRequest: HttpRequest = {
    userId: 'any_guardian_id'
  }

  it('Should returns 500 (ServerError) if LoadPets throws', async () => {
    const { sut, loadPetsStub } = makeSut()
    jest.spyOn(loadPetsStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(fakeHttpRequest)
    expect(httpResponse).toEqual(makeFakeServerError())
  })

  it('Should LoadPets return an empty array if there are not pets registered', async () => {
    const { sut, loadPetsStub } = makeSut()
    jest.spyOn(loadPetsStub, 'load').mockResolvedValueOnce([])
    const httpResponse = await sut.handle(fakeHttpRequest)
    expect(httpResponse).toEqual(success([]))
  })

  it('Should call LoadPets with correct value', async () => {
    const { sut, loadPetsStub } = makeSut()
    const loadPetsSpy = jest.spyOn(loadPetsStub, 'load')
    await sut.handle(fakeHttpRequest)
    expect(loadPetsSpy).toHaveBeenCalledWith({ guardianId: 'any_guardian_id' })
  })

  it('Should return a list of pets on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(fakeHttpRequest)
    expect(httpResponse).toEqual(success([{
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
      castrated: false
    }]))
  })
})
