import { ForgetPasswordController } from '@/application/controllers/forget-password'

const makeSut = (): ForgetPasswordController => {
  const sut = new ForgetPasswordController()
  return sut
}

describe('ForgetPassword Controller', () => {
  it('Should return 400 if no email is provided', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {}
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
