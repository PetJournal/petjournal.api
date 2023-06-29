import {
  type LoadGuardianByEmailRepository,
  type HashComparer
} from '@/data/protocols'
import {
  makeFakeGuardianRepository,
  makeFakeHashService,
  mockFakeGuardianLoaded
} from '@/tests/utils'
import { VerificationTokenError, NotFoundError } from '@/application/errors'
import { DbValidateVerificationToken } from '@/data/use-cases'

interface SutTypes {
  sut: DbValidateVerificationToken
  guardianRepositoryStub: LoadGuardianByEmailRepository
  hashServiceStub: HashComparer
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const hashServiceStub = makeFakeHashService()
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

  describe('GuardianRepository', () => {
    it('Should return NotFoundError if not found email is provided', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockResolvedValueOnce(undefined)

      const result = await sut.validate(fakeValidation)

      expect(result).toStrictEqual(new NotFoundError('email'))
    })

    it('Should return ExpiredVerificationTokenError expired token is provided', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockResolvedValueOnce({
        ...mockFakeGuardianLoaded(),
        verificationTokenCreatedAt: new Date(2023, 0, 0, 0, 0, 0)
      })

      const result = await sut.validate(fakeValidation)

      expect(result).toStrictEqual(new VerificationTokenError())
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
    it('Should return VerificationTokenError if invalid code is provided', async () => {
      const { sut, hashServiceStub } = makeSut()
      jest.spyOn(hashServiceStub, 'compare').mockResolvedValueOnce(false)

      const result = await sut.validate(fakeValidation)

      expect(result).toStrictEqual(new VerificationTokenError())
    })

    it('Should throw if compare throws', async () => {
      const { sut, hashServiceStub } = makeSut()
      jest.spyOn(hashServiceStub, 'compare').mockRejectedValueOnce(new Error())

      const promise = sut.validate(fakeValidation)

      await expect(promise).rejects.toThrow()
    })

    it('Should call compare with correct values', async () => {
      const { sut, hashServiceStub } = makeSut()
      const spyHashComparer = jest.spyOn(hashServiceStub, 'compare')
      const { verificationToken } = mockFakeGuardianLoaded()

      await sut.validate(fakeValidation)

      expect(spyHashComparer).toHaveBeenCalledWith({
        value: fakeValidation.verificationToken,
        hash: verificationToken
      })
    })
  })

  describe('When success', () => {
    it('Should return true if a valid access token is provided', async () => {
      const { sut } = makeSut()

      const result = await sut.validate(fakeValidation)

      expect(result).toBeTruthy()
    })
  })
})
