import { type AddGuardianRepository, type Encrypter } from 'data/protocols'
import { type AddGuardian } from '../../domain/use-cases'

export class DbAddGuardian implements AddGuardian {
  private readonly addGuardianRepository: AddGuardianRepository
  private readonly encrypter: Encrypter

  constructor (addGuardianRepository: AddGuardianRepository, encrypter: Encrypter) {
    this.addGuardianRepository = addGuardianRepository
    this.encrypter = encrypter
  }

  async add (guardianData: AddGuardian.Params): Promise<AddGuardian.Result> {
    const hashedPassword = await this.encrypter.encrypt(guardianData.password)
    return await this.addGuardianRepository.add(Object.assign({}, guardianData, { password: hashedPassword }))
  }
}
