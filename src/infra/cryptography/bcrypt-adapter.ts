import bcrypt from 'bcrypt'
import { type HashComparer, type HashGenerator } from '@/data/protocols'

export class BcryptAdapter implements HashGenerator, HashComparer {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async encrypt (input: HashGenerator.Params): Promise<HashGenerator.Result> {
    return await bcrypt.hash(input.value, this.salt)
  }

  async compare (input: HashComparer.Params): Promise<HashComparer.Result> {
    const isValid = await bcrypt.compare(input.value, input.hash)
    return isValid
  }
}
