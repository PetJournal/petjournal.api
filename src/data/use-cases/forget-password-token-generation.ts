import { type SaveToken } from '@/domain/use-cases'
import { type Encrypter, type TokenGenerator } from '../protocols'

export class ForgetPasswordTokenGenerator implements TokenGenerator {
  private readonly encrypter: Encrypter
  private readonly saveToken: SaveToken

  constructor (encrypter: Encrypter, saveToken: SaveToken) {
    this.encrypter = encrypter
    this.saveToken = saveToken
  }

  async generate (userId: number): Promise<string> {
    const token = Math.floor(100000 + Math.random() * 900000).toString()
    const encryptedToken = await this.encrypter.encrypt(token)
    await this.saveToken.save({ accountId: userId, token: encryptedToken })
    return token
  }
}
