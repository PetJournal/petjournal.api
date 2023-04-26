import { type LoadGuardianByEmailRepository, type AddGuardianRepository } from '@/data/protocols'
import { prisma as db } from './prisma'

export class GuardianAccountRepository implements AddGuardianRepository, LoadGuardianByEmailRepository {
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

  async loadByEmail (email: string): Promise<LoadGuardianByEmailRepository.Result> {
    const guardian = await db.guardian.findUnique({
      where: { email }
    })

    if (guardian) {
      return guardian
    }
  }
}
