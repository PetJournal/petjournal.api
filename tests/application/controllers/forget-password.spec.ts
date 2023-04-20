import { ForgetPasswordController } from '@/application/controllers/forget-password'

describe('ForgetPassword Controller', () => {
  it('Should return 400 if no email is provided', async () => {
    const sut = new ForgetPasswordController()
    const httpRequest = {
      body: {}
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
