import { EmailConfirmationError, NotFoundError } from '@/application/errors'
import { type HttpRequest, noContent, serverError, unauthorized } from '@/application/helpers'
import { AccountConfirmationMiddleware } from '@/application/middlewares/account-confirmation'
import { type LoadGuardianByIdRepository, type LoadGuardianByEmailRepository } from '@/data/protocols'
import {
  makeFakeGuardianRepository
} from '@/tests/utils'

interface SutTypes {
  sut: AccountConfirmationMiddleware
  guardianRepositoryStub: LoadGuardianByEmailRepository & LoadGuardianByIdRepository
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const sut = new AccountConfirmationMiddleware({
    guardianRepository: guardianRepositoryStub
  })

  return {
    sut,
    guardianRepositoryStub
  }
}

describe('AccountConfirmationMiddleware', () => {
  const httpRequest: HttpRequest = {
    body: {
      email: 'any_mail@mail.com'
    }
  }

  describe('GuardianRepository', () => {
    it('Should call loadByEmail with correct value', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadByEmailSpy = jest.spyOn(guardianRepositoryStub, 'loadByEmail')
      await sut.handle(httpRequest)
      expect(loadByEmailSpy).toBeCalledWith(httpRequest.body.email)
    })

    it('Should call loadById with correct value', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadByIdSpy = jest.spyOn(guardianRepositoryStub, 'loadById')
      const httpRequestWithUserId: HttpRequest = { body: {}, userId: 'any_user_id' }
      await sut.handle(httpRequestWithUserId)
      expect(loadByIdSpy).toHaveBeenCalledWith(httpRequestWithUserId.userId)
    })

    it('Shoul return 500 (ServerError) if loadByEmail method throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest
        .spyOn(guardianRepositoryStub, 'loadByEmail')
        .mockRejectedValueOnce(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(serverError(new Error()))
    })

    it('Should return 401 (Unauthorized) if loadByEmail returns null', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null)
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(unauthorized(new NotFoundError('User not found')))
    })

    it('Should return 401 (Unauthorized) if emailConfirmation is false', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockResolvedValueOnce({
        id: 'any_id',
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        password: 'any_hashed_password',
        phone: 'any_phone',
        accessToken: 'any_hashed_token',
        verificationToken: 'any_verification_token',
        verificationTokenCreatedAt: new Date(),
        emailConfirmation: false
      })
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(
        unauthorized(new EmailConfirmationError('your email are not confirmed'))
      )
    })

    it('Should return 204 (No Content) on success', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(noContent())
    })
  })
})
