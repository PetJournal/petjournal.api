import { type LoadAccountByEmailRepository, type AddGuardianRepository } from '@/data/protocols'
import { prisma as db } from './prisma'
import { type Guardian } from '@/domain/models/guardian'

export class GuardianAccountRepository implements AddGuardianRepository, LoadAccountByEmailRepository {
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

  async loadByEmail (email: string): Promise<Guardian | null> {
    const guardianDb = await db.guardian.findUnique({ where: { email } })
    if (!guardianDb) {
      return null
    }
    const guardian = {
      id: guardianDb.id,
      firstName: guardianDb.firstName,
      lastName: guardianDb.lastName,
      email: guardianDb.email,
      phone: guardianDb.phone,
      password: guardianDb.password,
      isPrivacyPolicyAccepted: guardianDb.isPrivacyPolicyAccepted
    }
    return guardian
  }
}
