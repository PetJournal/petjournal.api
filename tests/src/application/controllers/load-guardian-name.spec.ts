import { LoadGuardianNameController } from '@/application/controllers'
import { type GetGuardianName } from '@/domain/use-cases/get-guardian-name'

describe('LoadGuardianName Controller', () => {
  it('Should call GetGuardianName with correct values', async () => {
    class GetGuardianNameStub implements GetGuardianName {
      async load (): Promise<string> {
        return 'any_first_name any_last_name'
      }
    }
    const getGuardianNameStub = new GetGuardianNameStub()
    const sut = new LoadGuardianNameController({ getGuardianName: getGuardianNameStub })
    const getGuardianNameSpy = jest.spyOn(getGuardianNameStub, 'load')
    await sut.handle({ userId: 'any_user_id' })
    expect(getGuardianNameSpy).toHaveBeenCalledWith('any_user_id')
  })
})
