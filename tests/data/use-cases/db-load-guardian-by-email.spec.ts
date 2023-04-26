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
    const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadGuardianByEmailRepositoryStub, 'load')
    await sut.load('any_email@mail.com')
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should throw if LoadGuardianByEmailRespository throw', async () => {
    const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadGuardianByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.load('any_email@mail.com')
    await expect(promise).rejects.toThrow()
  })

  it('Should return an guardian on success', async () => {
    const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadGuardianByEmailRepositoryStub, 'load')
    const guardian = await sut.load('any_email@mail.com')
    expect(guardian).toEqual({
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
})
