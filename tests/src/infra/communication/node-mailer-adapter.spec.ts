import { type EmailService } from '@/data/protocols'
import { NodeMailerAdapter } from '@/infra/communication'

jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn().mockImplementation(() => {
      return {
        sendMail: jest.fn().mockResolvedValue({
          messageId: 'mock-message-id'
        })
      }
    })
  }
})

interface SutTypes {
  sut: NodeMailerAdapter
}

const makeFakeMailOptions = (): EmailService.Options => ({
  from: 'any_email@mail.com',
  to: 'other_email@mail.com',
  subject: 'any_subject',
  text: 'any_text'
})

const makeSut = (): SutTypes => {
  const transporter = {
    service: 'any_service',
    auth: {
      user: 'any_user',
      pass: 'any_pass'
    }
  }
  const sut = new NodeMailerAdapter(transporter)
  return {
    sut
  }
}

describe('NodeMailerAdapter', () => {
  it('Should call send with correct values', async () => {
    const { sut } = makeSut()
    const sendSpy = jest.spyOn(sut, 'send')
    await sut.send(makeFakeMailOptions())
    expect(sendSpy).toHaveBeenCalledWith(makeFakeMailOptions())
  })

  it('Should return true on success', async () => {
    const { sut } = makeSut()
    const isSuccess = await sut.send(makeFakeMailOptions())
    expect(isSuccess).toBe(true)
  })

  it('Should return false on fail', async () => {
    const { sut } = makeSut()
    jest.spyOn(sut, 'send').mockResolvedValueOnce(false)
    const isSuccess = await sut.send(makeFakeMailOptions())
    expect(isSuccess).toBe(false)
  })

  it('Should throw if send throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(sut, 'send').mockRejectedValueOnce(new Error())
    const promise = sut.send(makeFakeMailOptions())
    await expect(promise).rejects.toThrow()
  })
})
