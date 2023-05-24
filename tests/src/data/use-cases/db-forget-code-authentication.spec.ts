import { NotFoundError } from '@/application/errors'
import { type LoadGuardianByEmailRepository } from '@/data/protocols'
import { DbForgetCodeAuthentication } from '@/data/use-cases/db-forget-code-authentication'
import { makeFakeGuardianWithIdData, makeLoadGuardianByEmail } from '@/tests/utils'

interface SutTypes {
  sut: DbForgetCodeAuthentication
  loadGuardianByEmailRepositoryStub: LoadGuardianByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadGuardianByEmailRepositoryStub = makeLoadGuardianByEmail(makeFakeGuardianWithIdData())
  const sut = new DbForgetCodeAuthentication({ loadGuardianByEmailRepository: loadGuardianByEmailRepositoryStub })
  return {
    sut,
    loadGuardianByEmailRepositoryStub
  }
}

describe('DbForgetCodeAuthentication UseCase', () => {
  const fakeInput = {
    email: 'any_email',
    forgetPasswordCode: 'any_code'
  }
  describe('tests LoadGuardianByEmailRepository', () => {
    it('Should call LoadGuardianByEmailRepository with correct email', async () => {
      const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail')

      await sut.auth(fakeInput)

      expect(loadSpy).toHaveBeenCalledWith(fakeInput.email)
    })

    it('Should return NotFoundError if not found email is provided', async () => {
      const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
      jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(undefined)

      const result = await sut.auth(fakeInput)

      expect(result).toStrictEqual(new NotFoundError('email'))
    })
  })
})
