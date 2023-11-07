import { prisma as db } from './prisma'
import {
  type AddGuardianRepository,
  type LoadGuardianByIdRepository,
  type LoadGuardianByEmailRepository,
  type UpdateAccessTokenRepository,
  type UpdateGuardianPasswordRepository,
  type UpdateVerificationTokenRepository,
  type LoadGuardianByPhoneRepository
} from '@/data/protocols'

export class GuardianAccountRepository implements AddGuardianRepository,
LoadGuardianByEmailRepository,
LoadGuardianByIdRepository,
UpdateAccessTokenRepository,
UpdateGuardianPasswordRepository,
UpdateVerificationTokenRepository {
  async add (guardianData: AddGuardianRepository.Params): Promise<AddGuardianRepository.Result> {
    return await db.guardian.create({
      data: guardianData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        verificationToken: false
      }
    })
  }

  async loadByEmail (email: LoadGuardianByEmailRepository.Params): Promise<LoadGuardianByEmailRepository.Result> {
    const guardian = await db.guardian.findUnique({ where: { email } })
    if (guardian) {
      return guardian
    }
  }

  async loadById (id: LoadGuardianByIdRepository.Params): Promise<LoadGuardianByIdRepository.Result> {
    const guardian = await db.guardian.findUnique({ where: { id } })
    if (guardian) {
      return guardian
    }
  }

  async loadByPhone (phone: LoadGuardianByPhoneRepository.Params): Promise<LoadGuardianByPhoneRepository.Result> {
    const guardian = await db.guardian.findUnique({ where: { phone } })
    if (guardian) {
      return guardian
    }
  }

  async updateAccessToken (authentication: UpdateAccessTokenRepository.Params): Promise<UpdateAccessTokenRepository.Result> {
    const { id, token } = authentication
    const result = await db.guardian.update({ where: { id }, data: { accessToken: token } })
    return Boolean(result)
  }

  async updateVerificationToken (credentials: UpdateVerificationTokenRepository.Params): Promise<UpdateVerificationTokenRepository.Result> {
    let success: boolean = false
    const guardian = await db.guardian.findUnique({
      where: { id: credentials.userId }
    })

    if (guardian) {
      await db.guardian.update({
        where: { id: credentials.userId },
        data: { verificationToken: credentials.token, verificationTokenCreatedAt: new Date() }
      })

      success = true
    }

    return success
  }

  async updatePassword (userData: UpdateGuardianPasswordRepository.Params): Promise<UpdateGuardianPasswordRepository.Result> {
    const guardian = await db.guardian.findUnique({
      where: { id: userData.id }
    })
    if (guardian) {
      await db.guardian.update({
        where: { id: userData.id },
        data: { password: userData.password }
      })
    }
    return Boolean(guardian)
  }
}
