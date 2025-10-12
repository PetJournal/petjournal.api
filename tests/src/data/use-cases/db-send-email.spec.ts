import { NotFoundError } from '@/application/errors'
import { type EmailService, type LoadGuardianByEmailRepository } from '@/data/protocols'
import { DbSendEmail } from '@/data/use-cases'
import env from '@/main/config/env'
import { makeFakeEmailService, makeFakeGuardianRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbSendEmail
  guardianRepositoryStub: LoadGuardianByEmailRepository
  emailServiceStub: EmailService
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const emailServiceStub = makeFakeEmailService()
  const sut = new DbSendEmail({ guardianRepository: guardianRepositoryStub, emailService: emailServiceStub })

  return {
    sut,
    guardianRepositoryStub,
    emailServiceStub
  }
}

describe('DbSendEmail', () => {
  const data = { email: 'any_email' }

  it('Should call GuardianRepository with correct value', async () => {
    const { sut, guardianRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(guardianRepositoryStub, 'loadByEmail')
    await sut.send(data)
    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email')
  })

  it('Should throw if GuardianRepository throws', async () => {
    const { sut, guardianRepositoryStub } = makeSut()
    jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())
    const promise = sut.send(data)
    await expect(promise).rejects.toThrow()
  })

  it('Should throw NotFoundError if GuardianRepository returns null', async () => {
    const { sut, guardianRepositoryStub } = makeSut()
    jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null)
    const promise = sut.send(data)
    await expect(promise).rejects.toThrow(new NotFoundError('guardian'))
  })

  it('Should call EmailService with correct value', async () => {
    const { sut, emailServiceStub } = makeSut()
    const sendEmailSpy = jest.spyOn(emailServiceStub, 'send')
    await sut.send(data)
    expect(sendEmailSpy).toHaveBeenCalledWith({
      from: {
        email: env.emailPetJournal,
        name: 'Pet Journal'
      },
      to: {
        email: 'any_email@mail.com',
        name: 'any_last_name'
      },
      subject: 'Ative sua conta',
      text: `
          Olá any_first_name any_last_name,\n
          Acesse o link para ativar sua conta: http://localhost:3333/api/guardian/email-confirmation/any_id
        `
    })
  })

  it('Should throw if EmailService throws', async () => {
    const { sut, emailServiceStub } = makeSut()
    jest.spyOn(emailServiceStub, 'send').mockRejectedValueOnce(new Error())
    const promise = sut.send(data)
    await expect(promise).rejects.toThrow()
  })
})
