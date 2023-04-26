import { type LoadGuardianByEmail } from '@/domain/use-cases'
import { DbLoadGuardianByEmail } from '@/data/use-cases'
import { type LoadGuardianByEmailRepository } from '@/data/protocols'

interface SutTypes {
  sut: DbLoadGuardianByEmail
  loadGuardianByEmailRepositoryStub: LoadGuardianByEmailRepository
}

const makeLoadGuardianByEmailRepository = (): LoadGuardianByEmailRepository => {
  class LoadGuardianByEmailRepositoryStub implements LoadGuardianByEmailRepository {
    async load (email: string): Promise<LoadGuardianByEmail.Result> {
      return await new Promise(resolve => {
        resolve({
          id: 1,
          firstName: 'any_first_name',
          lastName: 'any_last_name',
          email: 'any_email@mail.com',
          phone: 'any_phone',
          password: 'any_password',
          passwordConfirmation: 'any_password',
          isPrivacyPolicyAccepted: true
        })
      })
    }
  }
  return new LoadGuardianByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadGuardianByEmailRepositoryStub = makeLoadGuardianByEmailRepository()
  const sut = new DbLoadGuardianByEmail(loadGuardianByEmailRepositoryStub)
  return {
    sut,
    loadGuardianByEmailRepositoryStub
  }
}

describe('DbLoadGuardianByEmail', () => {
  it('Should call LoadGuardianByEmailRepository with correct email', async () => {
    const { sut } = makeSut()
    const loadSpy = jest.spyOn(sut, 'load')
    await sut.load('any_email@mail.com')
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
