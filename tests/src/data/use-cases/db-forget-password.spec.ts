import { type ForgetPassword } from '@/domain/use-cases'
import { type TokenGenerator, type LoadGuardianByEmailRepository, type EmailService } from '@/data/protocols'
import { DbForgetPassword } from '@/data/use-cases'
import { makeFakeTokenGenerator, makeFakeLoadGuardianByEmailRepository } from '@/tests/utils'

const makeEmailService = (): EmailService => {
  class EmailServiceStub implements EmailService {
    async send (options: EmailService.Options): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new EmailServiceStub()
}

interface SutTypes {
  sut: DbForgetPassword
  loadGuardianByEmailStub: LoadGuardianByEmailRepository
  tokenGeneratorStub: TokenGenerator
  emailServiceStub: EmailService
}

const makeSut = (): SutTypes => {
  const tokenGeneratorStub = makeFakeTokenGenerator()
  const emailServiceStub = makeEmailService()
  const loadGuardianByEmailStub = makeFakeLoadGuardianByEmailRepository()
  const dependencies: ForgetPassword.Dependencies = {
    loadGuardianByEmailRepository: loadGuardianByEmailStub,
    tokenGenerator: tokenGeneratorStub,
    emailService: emailServiceStub
  }
  const sut = new DbForgetPassword(dependencies)
  return {
    sut,
    loadGuardianByEmailStub,
    tokenGeneratorStub,
    emailServiceStub
  }
}

describe('DbForgetPassword UseCase', () => {
  const params: ForgetPassword.Params = {
    email: 'any_email@mail.com'
  }
  describe('LoadGuardianByEmailRepository', () => {
    it('Should call LoadGuardianByEmailRepository with correct value', async () => {
      const { sut, loadGuardianByEmailStub } = makeSut()
      const loadByEmailSpy = jest.spyOn(loadGuardianByEmailStub, 'loadByEmail')
      await sut.forgetPassword(params)
      expect(loadByEmailSpy).toHaveBeenCalledWith(params.email)
    })

    it('Should throw if LoadGuardianByEmailRepository throws', async () => {
      const { sut, loadGuardianByEmailStub } = makeSut()
      jest.spyOn(loadGuardianByEmailStub, 'loadByEmail').mockRejectedValue(new Error())
      const promise = sut.forgetPassword(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should return false if email does not exist', async () => {
      const { sut, loadGuardianByEmailStub } = makeSut()
      jest.spyOn(loadGuardianByEmailStub, 'loadByEmail').mockResolvedValue(undefined)
      const result = await sut.forgetPassword(params)
      expect(result).toBeFalsy()
    })
  })

  describe('Token Generator', () => {
    it('Should call TokenGenerator with correct userId', async () => {
      const { sut, tokenGeneratorStub } = makeSut()
      const tokenGeneratorSpy = jest.spyOn(tokenGeneratorStub, 'generate')
      await sut.forgetPassword(params)
      expect(tokenGeneratorSpy).toHaveBeenCalledWith('any_id')
    })

    it('Should throw if TokenGenerator throws', async () => {
      const { sut, tokenGeneratorStub } = makeSut()
      jest.spyOn(tokenGeneratorStub, 'generate').mockRejectedValue(new Error())
      const promise = sut.forgetPassword(params)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('Email Service', () => {
    it('Should call EmailService with correct values', async () => {
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

    it('Should throw if EmailService throws', async () => {
      const { sut, emailServiceStub } = makeSut()
      jest.spyOn(emailServiceStub, 'send').mockRejectedValue(new Error())
      const promise = sut.forgetPassword(params)
      await expect(promise).rejects.toThrow()
    })
  })

  test('Should return true if all succeeds', async () => {
    const { sut } = makeSut()
    const isSuccess = await sut.forgetPassword(params)
    expect(isSuccess).toBe(true)
  })
})
