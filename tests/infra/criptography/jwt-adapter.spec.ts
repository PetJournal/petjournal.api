import { JwtAdapter } from '@/infra/criptography/jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await new Promise(resolve => { resolve('any_token') })
  }
}))

describe('Jwt Adapter', () => {
  it('Should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret')
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toBeCalledWith({ payload: 'any_id' }, 'secret')
  })
})
