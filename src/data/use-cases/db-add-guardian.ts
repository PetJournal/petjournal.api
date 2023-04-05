import { type AddGuardianRepository, type Encrypter } from 'data/protocols'
import { type Guardian } from '../../domain/entities'
import { type AddGuardian, type IAddGuardian } from '../../domain/use-cases'

export class DbAddGuardian implements AddGuardian {
  private readonly addGuardianRepository: AddGuardianRepository
  private readonly encrypter: Encrypter

  constructor (addGuardianRepository: AddGuardianRepository, encrypter: Encrypter) {
    this.addGuardianRepository = addGuardianRepository
    this.encrypter = encrypter
  }

  async add (guardianData: IAddGuardian): Promise<Guardian> {
    const hashedPassword = await this.encrypter.encrypt(guardianData.password)
    await this.addGuardianRepository.add(Object.assign({}, guardianData, { password: hashedPassword }))

    return await new Promise(resolve => { resolve(null) })
  }
}
