import { type EmailService } from '@/data/protocols'
import { DbSendEmail } from '@/data/use-cases'
import env from '@/main/config/env'
import { makeFakeEmailService } from '@/tests/utils'

interface SutTypes {
  sut: DbSendEmail
  emailServiceStub: EmailService
}

const makeSut = (): SutTypes => {
  const emailServiceStub = makeFakeEmailService()
  const sut = new DbSendEmail({ emailService: emailServiceStub })

  return {
    sut,
    emailServiceStub
  }
}

describe('DbSendEmail', () => {
  const data = {
    id: 'any_id',
    firstName: 'any_first_name',
    lastName: 'any_last_name',
    email: 'any_email@mail.com'
  }

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
          Olá any_first_name any_last_name,\\n
          Acesse o link para ativar sua conta: ${env.host}/api/guardian/email-confirmation/any_id
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
