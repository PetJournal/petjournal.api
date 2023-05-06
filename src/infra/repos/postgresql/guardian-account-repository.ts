import { type LoadGuardianByEmailRepository, type AddGuardianRepository, type SaveTokenRepository } from '@/data/protocols'
import { prisma as db } from './prisma'

export class GuardianAccountRepository implements AddGuardianRepository, LoadGuardianByEmailRepository, SaveTokenRepository {
  async add (guardianData: AddGuardianRepository.Params): Promise<AddGuardianRepository.Result> {
    let success: boolean = false
    const guardianHasEmailRegistered = await db.guardian.findUnique({
      where: { email: guardianData.email }
    })

    const guardianHasPhoneRegistered = await db.guardian.findUnique({
      where: { phone: guardianData.phone }
    })

    if (!guardianHasEmailRegistered && !guardianHasPhoneRegistered) {
      await db.guardian.create({
        data: guardianData
      })

      success = true
    }
    return success
  }

  async loadByEmail (email: LoadGuardianByEmailRepository.Params): Promise<LoadGuardianByEmailRepository.Result> {
    const guardian = await db.guardian.findUnique({
      where: { email }
    })

    if (guardian) {
      return guardian
    }
  }

  async saveToken (accountId: number, token: string): Promise<SaveTokenRepository.Result> {
    let success: boolean = false
    const guardian = await db.guardian.findUnique({
      where: { id: accountId }
    })

    if (guardian) {
      await db.guardian.update({
        where: { id: accountId },
        data: { forgetPasswordToken: token }
      })

      success = true
    }

    return success
  }
}
