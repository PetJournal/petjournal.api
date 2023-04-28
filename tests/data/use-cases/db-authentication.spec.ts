import { type AddGuardian, DbAuthentication } from '@/domain/use-cases'
import { type LoadAccountByEmailRepository } from '@/data/protocols/load-account-by-email-repository'

describe('DbAuthentication UseCase', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AddGuardian.Params> {
        const account: AddGuardian.Params = {
          firstName: 'valid_first_name',
          lastName: 'valid_last_name',
          email: 'valid_email@mail.com',
          phone: 'valid_phone',
          password: 'valid_password',
          isPrivacyPolicyAccepted: true
        }
        return await new Promise(resolve => { resolve(account) })
      }
    }
    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
