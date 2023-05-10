import { AuthMiddleware } from '@/application/middlewares/auth'

describe('Auth Middleware', () => {
  it('Should return 401 if no authorization is provided', async () => {
    const sut = new AuthMiddleware()
    const httpRequest = { header: {} }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(401)
  })
})
