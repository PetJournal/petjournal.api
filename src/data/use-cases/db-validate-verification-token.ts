import { NotFoundError, UnauthorizedError } from '@/application/errors'
import {
  type LoadGuardianByEmailRepository,
  type HashComparer
} from '@/data/protocols'
import { type ValidateVerificationToken } from '@/domain/use-cases/validate-verification-token'

export class DbValidateVerificationToken implements ValidateVerificationToken {
  private readonly guardianRepository: LoadGuardianByEmailRepository
  private readonly hashService: HashComparer

  constructor ({
    guardianRepository,
    hashService
  }: ValidateVerificationToken.Dependencies
  ) {
    this.guardianRepository = guardianRepository
    this.hashService = hashService
  }

  async validate (input: ValidateVerificationToken.Params): Promise<ValidateVerificationToken.Result> {
    const guardian = await this.guardianRepository.loadByEmail(input.email)
    if (!guardian) {
      return new NotFoundError('email')
    }
    const isValid = await this.hashService.compare({
      value: input.verificationToken,
      hash: guardian.verificationToken
    })
    if (!isValid) {
      return new UnauthorizedError('Verification token mismatch or expired')
    }
    return isValid
  }
}
