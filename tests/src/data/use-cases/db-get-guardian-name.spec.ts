import { DbGetGuardianName } from '@/data/use-cases'
import { makeFakeGuardianRepository } from '@/tests/utils'

describe('DbGetGuardianName', () => {
  describe('GuardianRepository', () => {
    it('Should call loadById method with correct value', async () => {
      const guardianRepositoryStub = makeFakeGuardianRepository()
      const sut = new DbGetGuardianName({ guardianRepository: guardianRepositoryStub })
      const loadByIdSpy = jest.spyOn(guardianRepositoryStub, 'loadById')
      await sut.load('any_id')
      expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
    })
  })
})
