import { type Encrypter } from 'data/protocols/encrypter'
import { type Guardian } from '../../domain/entities'
import { type AddGuardian, type IAddGuardian } from '../../domain/use-cases'

export class DbAddGuardian implements AddGuardian {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (guardian: IAddGuardian): Promise<Guardian> {
    await this.encrypter.encrypt(guardian.password)
    return await new Promise(resolve => { resolve(null) })
  }
}
