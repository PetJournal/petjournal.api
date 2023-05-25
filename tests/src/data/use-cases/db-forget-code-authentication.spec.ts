import { InvalidForgetCodeError, NotFoundError } from '@/application/errors'
import { type HashComparer, type LoadGuardianByEmailRepository } from '@/data/protocols'
import { DbForgetCodeAuthentication } from '@/data/use-cases/db-forget-code-authentication'
import { makeFakeGuardianWithIdData, makeHashComparer, makeLoadGuardianByEmail } from '@/tests/utils'

interface SutTypes {
  sut: DbForgetCodeAuthentication
  loadGuardianByEmailRepositoryStub: LoadGuardianByEmailRepository
  hashComparerStub: HashComparer
}

const makeSut = (): SutTypes => {
  const loadGuardianByEmailRepositoryStub = makeLoadGuardianByEmail(makeFakeGuardianWithIdData())
  const hashComparerStub = makeHashComparer()
  const sut = new DbForgetCodeAuthentication({ loadGuardianByEmailRepository: loadGuardianByEmailRepositoryStub, hashComparer: hashComparerStub })
  return {
    sut,
    loadGuardianByEmailRepositoryStub,
    hashComparerStub
  }
}

describe('DbForgetCodeAuthentication UseCase', () => {
  const fakeInput = {
    email: 'any_email',
    forgetPasswordCode: 'any_code'
  }
  describe('tests LoadGuardianByEmailRepository', () => {
    it('Should return NotFoundError if not found email is provided', async () => {
      const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
      jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(undefined)

      const result = await sut.auth(fakeInput)

      expect(result).toStrictEqual(new NotFoundError('email'))
    })

    it('Should throw if LoadGuardianByEmailRepository throws', async () => {
      const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
      jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())

      const promise = sut.auth(fakeInput)

      await expect(promise).rejects.toThrow()
    })

    it('Should call LoadGuardianByEmailRepository with correct email', async () => {
      const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail')

      await sut.auth(fakeInput)

      expect(loadSpy).toHaveBeenCalledWith(fakeInput.email)
    })
  })
  describe('test HashComparer', () => {
    it('should return InvalidForgetCodeError if invalid code is provided', async () => {
      const { sut, hashComparerStub } = makeSut()
      jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)

      const result = await sut.auth(fakeInput)

      expect(result).toStrictEqual(new InvalidForgetCodeError())
    })

    it('Should throw if HashComparer throws', async () => {
      const { sut, hashComparerStub } = makeSut()
      jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error())

      const promise = sut.auth(fakeInput)

      await expect(promise).rejects.toThrow()
    })

    it('should call HashComparer with correct values', async () => {
      const { sut, hashComparerStub, loadGuardianByEmailRepositoryStub } = makeSut()
      const fakeGuardian = makeFakeGuardianWithIdData()
      jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(fakeGuardian)
      const spyHashComparer = jest.spyOn(hashComparerStub, 'compare')

      await sut.auth(fakeInput)

      expect(spyHashComparer).toHaveBeenCalledWith({ value: fakeInput.forgetPasswordCode, hash: fakeGuardian.forgetPasswordToken })
    })
  })
})
