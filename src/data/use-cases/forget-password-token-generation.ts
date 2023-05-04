import { type Encrypter, type TokenGenerator } from '../protocols'

export class ForgetPasswordTokenGenerator implements TokenGenerator {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async generate (userId: number): Promise<string> {
    const token = Math.floor(100000 + Math.random() * 900000).toString()
    await this.encrypter.encrypt(token)
    return token
  }
}
