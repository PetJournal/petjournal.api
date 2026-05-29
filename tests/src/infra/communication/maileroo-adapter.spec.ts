import { type EmailService } from '@/data/protocols'
import { MailerooAdapter } from '@/infra/communication'
import env from '@/main/config/env'

interface SutTypes {
  sut: MailerooAdapter
}

const makeFakeMailOptions = (): EmailService.Options => ({
  from: {
    name: 'any_name',
    email: 'any_email@mail.com'
  },
  to: {
    name: 'any_name',
    email: 'other_email@mail.com'
  },
  subject: 'any_subject',
  text: 'any_text'
})

const makeSut = (): SutTypes => {
  const sut = new MailerooAdapter()
  return {
    sut
  }
}

describe('MailerooAdapter', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as any
  })
  it('Should call fetch with correct values', async () => {
    const { sut } = makeSut()
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true })
    await sut.send(makeFakeMailOptions())
    expect(global.fetch).toHaveBeenCalledWith(
      env.mailerooApiSenderUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': env.mailerooApiKey
        },
        body: JSON.stringify({
          from: {
            display_name: 'any_name',
            address: 'any_email@mail.com'
          },
          to: {
            display_name: 'any_name',
            address: 'other_email@mail.com'
          },
          subject: 'any_subject',
          text: 'any_text',
          html: '<h1>any_text</h1>'
        })
      }
    )
  })

  it('Should return true on success', async () => {
    const { sut } = makeSut()
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true })
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
