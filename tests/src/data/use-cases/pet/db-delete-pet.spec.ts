import { NotAcceptableError, ServerError } from '@/application/errors'
import { type DeletePetByIdRepository, type LoadGuardianByIdRepository, type LoadPetByIdRepository } from '@/data/protocols'
import { DbDeletePet } from '@/data/use-cases'
import { type DeletePet } from '@/domain/use-cases'
import { makeFakeGuardianRepository, makeFakePetRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbDeletePet
  guardianRepositoryStub: LoadGuardianByIdRepository
  petRepositoryStub: LoadPetByIdRepository & DeletePetByIdRepository
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const petRepositoryStub = makeFakePetRepository()
  const dependencies: DeletePet.Dependencies = {
    guardianRepository: guardianRepositoryStub,
    petRepository: petRepositoryStub
  }
  const sut = new DbDeletePet(dependencies)
  return {
    sut,
    guardianRepositoryStub,
    petRepositoryStub
  }
}

describe('DbDeletePet  Use Case', () => {
  const params: DeletePet.Params = {
    guardianId: 'any_guardian_id',
    petId: 'any_pet_id'
  }

  describe('GuardianRepository', () => {
    it('Should call loadById method with correct value', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadByIdSpy = jest.spyOn(guardianRepositoryStub, 'loadById')
      await sut.delete(params)
      expect(loadByIdSpy).toHaveBeenCalledWith(params.guardianId)
    })

    it('Should return Not Acceptable error if incorrect guardianId is provided', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockResolvedValueOnce(null)
      const result = await sut.delete(params)
      expect(result).toEqual({
        isSuccess: false,
        error: new NotAcceptableError('userId')
      })
    })

    it('Should throw if loadById throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())
      const promise = sut.delete(params)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('PetRepository', () => {
    describe('loadById method', () => {
      it('Should call loadById with correct values', async () => {
        const { sut, petRepositoryStub } = makeSut()
        const loadByIdSpy = jest.spyOn(petRepositoryStub, 'loadById')
        await sut.delete(params)
        expect(loadByIdSpy).toHaveBeenLastCalledWith({ guardianId: params.guardianId, petId: params.petId })
      })

      it('Should return Not Acceptable error if incorrect petId is provided', async () => {
        const { sut, petRepositoryStub } = makeSut()
        jest.spyOn(petRepositoryStub, 'loadById').mockResolvedValueOnce(null)
        const result = await sut.delete(params)
        expect(result).toEqual({
          isSuccess: false,
          error: new NotAcceptableError('petId')
        })
      })

      it('Should throw if loadById throws', async () => {
        const { sut, petRepositoryStub } = makeSut()
        jest.spyOn(petRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())
        const promise = sut.delete(params)
        await expect(promise).rejects.toThrow()
      })
    })
    describe('deletebyId method', () => {
      it('Should call deleteById with correct values', async () => {
        const { sut, petRepositoryStub } = makeSut()
        const deleteByIdSpy = jest.spyOn(petRepositoryStub, 'deleteById')
        await sut.delete(params)
        expect(deleteByIdSpy).toHaveBeenLastCalledWith(params.petId)
      })

      it('Should return server error if incorrect petId is provided', async () => {
        const { sut, petRepositoryStub } = makeSut()
        jest.spyOn(petRepositoryStub, 'deleteById').mockResolvedValueOnce(undefined)
        const result = await sut.delete(params)
        expect(result).toEqual({
          isSuccess: false,
          error: new ServerError('delete error')
        })
      })

      it('Should throw if deleteById throws', async () => {
        const { sut, petRepositoryStub } = makeSut()
        jest.spyOn(petRepositoryStub, 'deleteById').mockRejectedValueOnce(new Error())
        const promise = sut.delete(params)
        await expect(promise).rejects.toThrow()
      })
    })

    it('Should return true if delete pet succeed', async () => {
      const { sut } = makeSut()
      const result = await sut.delete(params)
      expect(result).toEqual({ isSuccess: true })
    })
  })
})
