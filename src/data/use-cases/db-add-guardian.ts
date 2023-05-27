import { type AddGuardian } from '@/domain/use-cases'
import { type AddGuardianRepository, type HashGenerator } from '@/data/protocols'

export class DbAddGuardian implements AddGuardian {
  private readonly addGuardianRepository: AddGuardianRepository
  private readonly hashGenerator: HashGenerator

  constructor ({ addGuardianRepository, hashGenerator }: AddGuardian.Dependencies) {
    this.addGuardianRepository = addGuardianRepository
    this.hashGenerator = hashGenerator
  }

  async add (guardianData: AddGuardian.Params): Promise<AddGuardian.Result> {
    const hashedPassword = await this.hashGenerator.encrypt({ value: guardianData.password })
    return await this.addGuardianRepository.add(Object.assign({}, guardianData, { password: hashedPassword }))
  }
}
