import { NotFoundError } from '@/application/errors'
import { type LoadPetByIdRepository } from '@/data/protocols'
import { DbLoadPetById } from '@/data/use-cases/pet/db-load-pet-by-id'
import { type LoadPetById } from '@/domain/use-cases'
import { makeFakeLoadPetByIdRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbLoadPetById
  petRepositoryStub: LoadPetByIdRepository
}

const makeSut = (): SutTypes => {
  const petRepositoryStub = makeFakeLoadPetByIdRepository()
  const dependencies: LoadPetById.Dependencies = {
    petRepository: petRepositoryStub
  }
  const sut = new DbLoadPetById(dependencies)
  return {
    sut,
    petRepositoryStub
  }
}
describe('DbLoadPetsByGuardianId', () => {
  describe('petRepository', () => {
    const params = { guardianId: 'any_guardian_id', petId: 'any_pet_id' }

    it('Should throw if petRepository throws', async () => {
      const { sut, petRepositoryStub } = makeSut()
      jest.spyOn(petRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())
      const promise = sut.loadById(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should call loadById method with correct value', async () => {
      const { sut, petRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(petRepositoryStub, 'loadById')
      await sut.loadById(params)
      expect(loadSpy).toHaveBeenCalledWith({ guardianId: params.guardianId, petId: params.petId })
    })

    it('Should petRepository return NotFoundError if no pet registered', async () => {
      const { sut, petRepositoryStub } = makeSut()
      jest.spyOn(petRepositoryStub, 'loadById').mockResolvedValueOnce(null)
      const httpResponse = await sut.loadById(params)
      expect(httpResponse).toEqual({
        isSuccess: false,
        error: new NotFoundError('petId')
      })
    })

    it('Should return a pet on success', async () => {
      const { sut } = makeSut()
      const result = await sut.loadById(params)
      expect(result).toEqual({
        isSuccess: true,
        data: {
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
        }
      })
    })
  })
})
