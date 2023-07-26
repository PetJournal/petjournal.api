import { type LoadGuardianByIdRepository } from '@/data/protocols'
import { DbLoadGuardianName } from '@/data/use-cases'
import { makeFakeGuardianRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbLoadGuardianName
  guardianRepositoryStub: LoadGuardianByIdRepository
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const sut = new DbLoadGuardianName({ guardianRepository: guardianRepositoryStub })
  return {
    sut,
    guardianRepositoryStub
  }
}

describe('DbLoadGuardianName', () => {
  describe('GuardianRepository', () => {
    it('Should call loadById method with correct value', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadByIdSpy = jest.spyOn(guardianRepositoryStub, 'loadById')
      await sut.load('any_id')
      expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
    })
  })

  it('Should return undefined if guardianRepository returns undefined', async () => {
    const { sut, guardianRepositoryStub } = makeSut()
    jest.spyOn(guardianRepositoryStub, 'loadById').mockResolvedValueOnce(undefined)
    const guardian = await sut.load('any_id')
    expect(guardian).toBe(undefined)
  })

  it('Should throw if guardianRepository throws', async () => {
    const { sut, guardianRepositoryStub } = makeSut()
    jest.spyOn(guardianRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())
    const promise = sut.load('any_id')
    await expect(promise).rejects.toThrow()
  })

  it('Should return a guardian name on success', async () => {
    const { sut } = makeSut()
    const guardianName = await sut.load('any_id')
    expect(guardianName).toEqual({ firstName: 'any_first_name', lastName: 'any_last_name' })
  })
})
