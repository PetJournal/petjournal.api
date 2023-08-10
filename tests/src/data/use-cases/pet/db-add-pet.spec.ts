import { NotFoundError } from '@/application/errors'
import { type AddPetRepository, type LoadGuardianByIdRepository } from '@/data/protocols'
import { DbAddPet } from '@/data/use-cases'
import { type AddPet } from '@/domain/use-cases'
import { makeFakeGuardianRepository, makeFakePetRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbAddPet
  guardianRepositoryStub: LoadGuardianByIdRepository
  petRepositoryStub: AddPetRepository
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const petRepositoryStub = makeFakePetRepository()
  const sut = new DbAddPet({
    guardianRepository: guardianRepositoryStub,
    petRepository: petRepositoryStub
  })
  return {
    sut,
    guardianRepositoryStub,
    petRepositoryStub
  }
}

describe('DbAddPet Use Case', () => {
  const params: AddPet.Params = {
    guardianId: 'any_guardian_id',
    specieId: 'any_specie_id'
  }

  describe('GuardianRepository', () => {
    it('Should call loadById method with correct values', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadByEmailSpy = jest.spyOn(guardianRepositoryStub, 'loadById')

      await sut.add(params)

      expect(loadByEmailSpy).toHaveBeenCalledWith(params.guardianId)
    })

    it('Should throw if loadById method throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockRejectedValue(new Error())

      const promise = sut.add(params)

      await expect(promise).rejects.toThrow()
    })

    it('Should return not found error if incorrect id is provided', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockResolvedValueOnce(undefined)

      const result = await sut.add(params)

      expect(result).toEqual({
        isSuccess: false,
        error: new NotFoundError('userId')
      })
    })
  })

  describe('PetRepository', () => {
    it('Should throw if add method throws', async () => {
      const { sut, petRepositoryStub } = makeSut()
      jest.spyOn(petRepositoryStub, 'add').mockRejectedValue(new Error())

      const promise = sut.add(params)

      await expect(promise).rejects.toThrow()
    })
  })
})
