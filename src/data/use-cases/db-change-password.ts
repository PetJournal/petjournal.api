import { type ChangePassword } from '@/domain/use-cases'
import {
  type HashGenerator,
  type LoadGuardianByIdRepository,
  type UpdateGuardianPasswordRepository
} from '@/data/protocols'
import { NotFoundError } from '@/application/errors'

export class DbChangePassword implements ChangePassword {
  private readonly hashService: HashGenerator
  private readonly guardianRepository: LoadGuardianByIdRepository & UpdateGuardianPasswordRepository

  constructor ({
    hashService,
    guardianRepository
  }: ChangePassword.Dependencies
  ) {
    this.hashService = hashService
    this.guardianRepository = guardianRepository
  }

  async change (guardianData: ChangePassword.Params): Promise<ChangePassword.Result> {
    const account = await this.guardianRepository.loadById(guardianData.id)
    if (!account) {
      return {
        isSuccess: false,
        error: new NotFoundError('userId')
      }
    }
    const hashedPassword = await this.hashService.encrypt({ value: guardianData.password })

    await this.guardianRepository.updatePassword({
      userId: guardianData.id,
      password: hashedPassword
    })

    return {
      isSuccess: true
    }
  }
}
