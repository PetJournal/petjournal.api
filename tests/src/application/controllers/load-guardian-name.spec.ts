import { LoadGuardianNameController } from '@/application/controllers'
import { type GetGuardianName } from '@/domain/use-cases/get-guardian-name'
import { makeGetGuardianName } from '@/tests/utils'

interface SutTypes {
  sut: LoadGuardianNameController
  getGuardianNameStub: GetGuardianName
}

const makeSut = (): SutTypes => {
  const getGuardianNameStub = makeGetGuardianName()
  const sut = new LoadGuardianNameController({ getGuardianName: getGuardianNameStub })
  return {
    sut,
    getGuardianNameStub
  }
}

describe('LoadGuardianName Controller', () => {
  it('Should call GetGuardianName with correct values', async () => {
    const { sut, getGuardianNameStub } = makeSut()
    const getGuardianNameSpy = jest.spyOn(getGuardianNameStub, 'load')
    await sut.handle({ userId: 'any_user_id' })
    expect(getGuardianNameSpy).toHaveBeenCalledWith('any_user_id')
  })
})
