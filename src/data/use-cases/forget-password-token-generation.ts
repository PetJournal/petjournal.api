import { type TokenGenerator } from '../protocols'

export class ForgetPasswordTokenGenerator implements TokenGenerator {
  async generate (userId: number): Promise<string> {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }
}
