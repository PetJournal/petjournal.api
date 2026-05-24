import { type LoadPetByGuardianIdRepository } from '@/data/protocols'
import { DbLoadPetByGuardianId } from '@/data/use-cases'
import { type LoadPets } from '@/domain/use-cases'
import { makeFakeLoadPetByGuardianIdRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbLoadPetByGuardianId
  petRepositoryStub: LoadPetByGuardianIdRepository
}

const makeSut = (): SutTypes => {
  const petRepositoryStub = makeFakeLoadPetByGuardianIdRepository()
  const dependencies: LoadPets.Dependencies = {
    petRepository: petRepositoryStub
  }
  const sut = new DbLoadPetByGuardianId(dependencies)
  return {
    sut,
    petRepositoryStub
  }
}
describe('DbLoadPetsByGuardianId', () => {
  describe('petRepository', () => {
    it('Should throw if petRepository throws', async () => {
      const { sut, petRepositoryStub } = makeSut()
      const guardianId = { guardianId: 'any_guardian_id' }
      jest.spyOn(petRepositoryStub, 'loadByGuardianId').mockRejectedValueOnce(new Error())
      const promise = sut.load(guardianId)
      await expect(promise).rejects.toThrow()
    })

    it('Should call load method with correct value', async () => {
      const { sut, petRepositoryStub } = makeSut()
      const guardianId = { guardianId: 'any_guardian_id' }
      const loadSpy = jest.spyOn(petRepositoryStub, 'loadByGuardianId')
      await sut.load(guardianId)
      expect(loadSpy).toHaveBeenCalledWith('any_guardian_id')
    })

    it('Should petRepository return an empty array if there are no pets registered', async () => {
      const { sut, petRepositoryStub } = makeSut()
      const guardianId = { guardianId: 'any_guardian_id' }
      jest.spyOn(petRepositoryStub, 'loadByGuardianId').mockResolvedValueOnce([])
      const httpResponse = await sut.load(guardianId)
      expect(httpResponse).toEqual([])
    })

    it('Should return a list of pets on success', async () => {
      const { sut } = makeSut()
      const guardianId = { guardianId: 'any_guardian_id' }
      const result = await sut.load(guardianId)
      expect(result).toEqual([{
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
      }])
    })
  })
})
