import { type LoadGuardianByEmailRepository, type AddGuardianRepository, type UpdateAccessTokenRepository } from '@/data/protocols'
import { prisma as db } from './prisma'

export class GuardianAccountRepository implements AddGuardianRepository, LoadGuardianByEmailRepository, UpdateAccessTokenRepository {
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

  async loadByEmail (email: LoadGuardianByEmailRepository.Params): Promise<LoadGuardianByEmailRepository.Result | null> {
    const guardianDb = await db.guardian.findUnique({ where: { email } })
    if (!guardianDb) {
      return null
    }
    const guardian = {
      id: guardianDb.id,
      firstName: guardianDb.firstName,
      lastName: guardianDb.lastName,
      email: guardianDb.email,
      password: guardianDb.password,
      phone: guardianDb.phone,
      accessToken: guardianDb.accessToken,
      isPrivacyPolicyAccepted: guardianDb.isPrivacyPolicyAccepted
    }
    return guardian
  }

  async updateAccessToken (email: string, token: string): Promise<void> {
    await db.guardian.update({ where: { email }, data: { accessToken: token } })
  }
}
