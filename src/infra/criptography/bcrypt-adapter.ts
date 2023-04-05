import bcrypt from 'bcrypt'
import { type Encrypter } from '../../../src/data/protocols'

export class BcryptAdapter implements Encrypter {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async encrypt (value: string): Promise<string> {
    await bcrypt.hash(value, this.salt)
    return ''
  }
}
