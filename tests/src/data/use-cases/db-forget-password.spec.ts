import {
  type TokenGenerator,
  type LoadGuardianByEmailRepository,
  type EmailService
} from '@/data/protocols'
import { DbForgetPassword } from '@/data/use-cases'
import { type ForgetPassword } from '@/domain/use-cases'
import {
  makeFakeEmailService,
  makeFakeGuardianRepository,
  makeFakeTokenService
} from '@/tests/utils'

interface SutTypes {
  sut: DbForgetPassword
  guardianRepositoryStub: LoadGuardianByEmailRepository
  tokenServiceStub: TokenGenerator
  emailServiceStub: EmailService
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const tokenServiceStub = makeFakeTokenService()
  const emailServiceStub = makeFakeEmailService()
  const dependencies: ForgetPassword.Dependencies = {
    guardianRepository: guardianRepositoryStub,
    tokenService: tokenServiceStub,
    emailService: emailServiceStub
  }
  const sut = new DbForgetPassword(dependencies)
  return {
    sut,
    guardianRepositoryStub,
    tokenServiceStub,
    emailServiceStub
  }
}

describe('DbForgetPassword UseCase', () => {
  const params: ForgetPassword.Params = {
    email: 'any_email@mail.com'
  }

  describe('TokenService', () => {
    it('Should call generate method with correct userId', async () => {
      const { sut, tokenServiceStub } = makeSut()
      const tokenGeneratorSpy = jest.spyOn(tokenServiceStub, 'generate')
      await sut.forgetPassword(params)
      expect(tokenGeneratorSpy).toHaveBeenCalledWith('any_id')
    })

    it('Should throw if generate method throws', async () => {
      const { sut, tokenServiceStub } = makeSut()
      jest.spyOn(tokenServiceStub, 'generate').mockRejectedValue(new Error())
      const promise = sut.forgetPassword(params)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('EmailService', () => {
    it('Should call send method with correct values', async () => {
      const { sut, emailServiceStub } = makeSut()
      const sendSpy = jest.spyOn(emailServiceStub, 'send')

      await sut.forgetPassword(params)
      expect(sendSpy).toHaveBeenCalledWith({
        from: 'contato.petjournal@gmail.com',
        to: 'any_email@mail.com',
        subject: 'any_first_name any_last_name, aqui está seu código',
        text: `
          Olá any_first_name any_last_name,\n
          Recebemos uma solicitação para redefinir a senha de sua conta PetJournal.\n
          any_token\n
          Insira este código para concluir a redefinição.\n
          Obrigado por nos ajudar a manter sua conta segura.\n
          Equipe PetJournal
        `
      })
      expect(sendSpy).toBeTruthy()
    })

    it('Should throw if send method throws', async () => {
      const { sut, emailServiceStub } = makeSut()
      jest.spyOn(emailServiceStub, 'send').mockRejectedValue(new Error())
      const promise = sut.forgetPassword(params)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('GuardianRepository', () => {
    it('Should call loadByEmail method with correct value', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadByEmailSpy = jest.spyOn(guardianRepositoryStub, 'loadByEmail')
      await sut.forgetPassword(params)
      expect(loadByEmailSpy).toHaveBeenCalledWith(params.email)
    })

    it('Should throw if loadByEmail method throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockRejectedValue(new Error())
      const promise = sut.forgetPassword(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should return false if email does not exist', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockResolvedValue(undefined)
      const result = await sut.forgetPassword(params)
      expect(result).toBeFalsy()
    })
  })

  test('Should return true if all succeeds', async () => {
    const { sut } = makeSut()
    const isSuccess = await sut.forgetPassword(params)
    expect(isSuccess).toBe(true)
  })
})
