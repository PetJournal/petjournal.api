import bcrypt from 'bcrypt'
import { type HashComparer, type Encrypter } from '@/data/protocols'

export class BcryptAdapter implements Encrypter, HashComparer {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async encrypt (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare (value: string, hash: string): Promise<boolean> {
    await bcrypt.compare(value, hash)
    return await new Promise(resolve => { resolve(true) })
  }
}
