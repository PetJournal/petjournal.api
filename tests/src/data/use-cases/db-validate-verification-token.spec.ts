import {
  type LoadGuardianByEmailRepository,
  type HashComparer
} from '@/data/protocols'
import {
  makeFakeGuardianWithIdData,
  makeLoadGuardianByEmail,
  makeHashComparer
} from '@/tests/utils'
import { ExpiredVerificationTokenError, NotFoundError, UnauthorizedError } from '@/application/errors'
import { DbValidateVerificationToken } from '@/data/use-cases/db-validate-verification-token'

interface SutTypes {
  sut: DbValidateVerificationToken
  guardianRepositoryStub: LoadGuardianByEmailRepository
  hashServiceStub: HashComparer
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeLoadGuardianByEmail(makeFakeGuardianWithIdData())
  const hashServiceStub = makeHashComparer()
  const sut = new DbValidateVerificationToken(
    {
      guardianRepository: guardianRepositoryStub,
      hashService: hashServiceStub
    }
  )
  return {
    sut,
    guardianRepositoryStub,
    hashServiceStub
  }
}
describe('DbCreateAccessToken UseCase', () => {
  const fakeValidation = {
    email: 'any_email@email.com',
    verificationToken: 'valid_token'
  }

  describe('tests guardianRepository', () => {
    it('Should return NotFoundError if not found email is provided', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockResolvedValueOnce(undefined)

      const result = await sut.validate(fakeValidation)

      expect(result).toStrictEqual(new NotFoundError('email'))
    })

    it('Should return ExpiredVerificationTokenError expired token is provided', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockResolvedValueOnce({
        ...makeFakeGuardianWithIdData(),
        verificationTokenCreatedAt: new Date(2023, 0, 0, 0, 0, 0)
      })

      const result = await sut.validate(fakeValidation)

      expect(result).toStrictEqual(new ExpiredVerificationTokenError())
    })

    it('Should throw if loadByEmail throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())

      const promise = sut.validate(fakeValidation)

      await expect(promise).rejects.toThrow()
    })

    it('Should call loadByEmail with correct email', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(guardianRepositoryStub, 'loadByEmail')

      await sut.validate(fakeValidation)

      expect(loadSpy).toHaveBeenCalledWith(fakeValidation.email)
    })
  })

  describe('test HashComparer', () => {
    it('should return UnauthorizedError if invalid code is provided', async () => {
      const { sut, hashServiceStub } = makeSut()
      jest.spyOn(hashServiceStub, 'compare').mockResolvedValueOnce(false)

      const result = await sut.validate(fakeValidation)

      expect(result).toStrictEqual(new UnauthorizedError('Verification token mismatch or expired'))
    })

    it('Should throw if compare throws', async () => {
      const { sut, hashServiceStub } = makeSut()
      jest.spyOn(hashServiceStub, 'compare').mockRejectedValueOnce(new Error())

      const promise = sut.validate(fakeValidation)

      await expect(promise).rejects.toThrow()
    })

    it('should call compare with correct values', async () => {
      const { sut, hashServiceStub } = makeSut()
      const spyHashComparer = jest.spyOn(hashServiceStub, 'compare')

      await sut.validate(fakeValidation)

      expect(spyHashComparer).toHaveBeenCalledWith({
        value: fakeValidation.verificationToken,
        hash: makeFakeGuardianWithIdData().verificationToken
      })
    })
  })

  describe('When success', () => {
    it('should return true if a valid access token is provided', async () => {
      const { sut } = makeSut()

      const result = await sut.validate(fakeValidation)

      expect(result).toBeTruthy()
    })
  })
})
