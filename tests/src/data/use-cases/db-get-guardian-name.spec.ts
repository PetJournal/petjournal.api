import { type LoadGuardianByIdRepository } from '@/data/protocols'
import { DbGetGuardianName } from '@/data/use-cases'
import { makeFakeGuardianRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbGetGuardianName
  guardianRepositoryStub: LoadGuardianByIdRepository
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const sut = new DbGetGuardianName({ guardianRepository: guardianRepositoryStub })
  return {
    sut,
    guardianRepositoryStub
  }
}

describe('DbGetGuardianName', () => {
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
    jest.spyOn(guardianRepositoryStub, 'loadById').mockReturnValueOnce(Promise.resolve(undefined))
    const guardian = await sut.load('any_id')
    expect(guardian).toBe(undefined)
  })
})
