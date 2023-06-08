import { type ChangePassword } from '@/domain/use-cases'
import {
  type HashGenerator,
  type LoadGuardianByIdRepository,
  type UpdateGuardianPasswordRepository
} from '@/data/protocols'
import { NotFoundError } from '@/application/errors'

export class DbChangePassword implements ChangePassword {
  private readonly hashGenerator: HashGenerator
  private readonly loadGuardianByIdRepository: LoadGuardianByIdRepository
  private readonly updateGuardianPasswordRepository: UpdateGuardianPasswordRepository

  constructor ({
    hashGenerator,
    loadGuardianByIdRepository,
    updateGuardianPasswordRepository
  }: ChangePassword.Dependencies
  ) {
    this.hashGenerator = hashGenerator
    this.loadGuardianByIdRepository = loadGuardianByIdRepository
    this.updateGuardianPasswordRepository = updateGuardianPasswordRepository
  }

  async change (userData: ChangePassword.Params): Promise<ChangePassword.Result> {
    const account = await this.loadGuardianByIdRepository.loadById(userData.id)
    if (!account) {
      return {
        isSuccess: false,
        error: new NotFoundError('userId')
      }
    }
    const hashedPassword = await this.hashGenerator.encrypt({ value: account.password })

    await this.updateGuardianPasswordRepository.updatePassword({
      id: userData.id,
      password: hashedPassword
    })

    return {
      isSuccess: true
    }
  }
}
