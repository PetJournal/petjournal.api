import { type EmailService } from '@/domain/use-cases'
import { NodeMailerAdapter } from '@/infra/node-mailer-adapter'

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

describe('NodeMailerAdapter', () => {
  it('Should call send with correct values', async () => {
    const transporter = {
      service: 'any_service',
      auth: {
        user: 'any_user',
        pass: 'any_pass'
      }
    }
    const sut = new NodeMailerAdapter(transporter)
    const sendSpy = jest.spyOn(sut, 'send')
    const mailOptions: EmailService.Options = {
      from: 'any_email@mail.com',
      to: 'other_email@mail.com',
      subject: 'any_subject',
      text: 'any_text'
    }
    await sut.send(mailOptions)
    expect(sendSpy).toHaveBeenCalledWith(mailOptions)
  })
})
