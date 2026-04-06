import { type UpdateGuardianImageRepository } from '@/data/protocols/db/guardian/update-guardian-image-repository'
import { prisma as db } from './prisma'
import {
  type AddGuardianRepository,
  type LoadGuardianByIdRepository,
  type LoadGuardianByEmailRepository,
  type UpdateAccessTokenRepository,
  type UpdateGuardianPasswordRepository,
  type UpdateVerificationTokenRepository,
  type UpdateEmailConfirmationRepository
} from '@/data/protocols'
import { type UpdateGuardianRepository } from '@/data/protocols/db/guardian/update-guardian-repository'

export class GuardianAccountRepository
implements AddGuardianRepository, LoadGuardianByEmailRepository,
    LoadGuardianByIdRepository,
    UpdateAccessTokenRepository,
    UpdateGuardianPasswordRepository,
    UpdateVerificationTokenRepository,
  UpdateEmailConfirmationRepository,
  UpdateGuardianImageRepository,
  UpdateGuardianRepository {
  async add (
    guardianData: AddGuardianRepository.Params
  ): Promise<AddGuardianRepository.Result> {
    const guardianHasEmailOrPhoneRegistered = await db.guardian.findFirst({
      where: {
        OR: [{ email: guardianData.email }, { phone: guardianData.phone }]
      }
    })

    if (guardianHasEmailOrPhoneRegistered) {
      return undefined
    }

    return await db.guardian.create({
      data: {
        ...guardianData,
        settings: {
          create: {}
        }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        verificationToken: false,
        emailConfirmation: true
      }
    })
  }

  private async checkUserId (userId: string): Promise<boolean> {
    const result = await db.guardian.findUnique({ where: { id: userId } })
    return Boolean(result)
  }

  async loadByEmail (
    email: LoadGuardianByEmailRepository.Params
  ): Promise<LoadGuardianByEmailRepository.Result> {
    return await db.guardian.findUnique({ where: { email } })
  }

  async loadById (
    id: LoadGuardianByIdRepository.Params
  ): Promise<LoadGuardianByIdRepository.Result> {
    return await db.guardian.findUnique({ where: { id } })
  }

  async updateAccessToken (
    params: UpdateAccessTokenRepository.Params
  ): Promise<UpdateAccessTokenRepository.Result> {
    const { userId, token } = params

    const result = await this.checkUserId(userId)

    if (!result) {
      return false
    }

    await db.guardian.update({
      where: { id: userId },
      data: { accessToken: token }
    })

    return true
  }

  async updateVerificationToken (
    params: UpdateVerificationTokenRepository.Params
  ): Promise<UpdateVerificationTokenRepository.Result> {
    const { userId, token } = params

    const result = await this.checkUserId(userId)

    if (!result) {
      return false
    }

    await db.guardian.update({
      where: { id: userId },
      data: {
        verificationToken: token,
        verificationTokenCreatedAt: new Date()
      }
    })

    return true
  }

  async updatePassword (
    params: UpdateGuardianPasswordRepository.Params
  ): Promise<UpdateGuardianPasswordRepository.Result> {
    const { userId, password } = params

    const result = await this.checkUserId(userId)

    if (!result) {
      return false
    }

    await db.guardian.update({
      where: { id: userId },
      data: { password }
    })

    return true
  }

  async updateEmailConfirmation (
    userId: UpdateEmailConfirmationRepository.Params
  ): Promise<UpdateEmailConfirmationRepository.Result> {
    const result = await db.guardian.update({
      where: { id: userId },
      data: { emailConfirmation: true },
      select: { emailConfirmation: true }
    })

    return result.emailConfirmation
  }

  async updateImage (params: UpdateGuardianImageRepository.Params): Promise<UpdateGuardianImageRepository.Result> {
    try {
      const { guardianId, image } = params
      const result = await db.guardian.update({
        where: { id: guardianId },
        data: { image },
        omit: {
          password: true,
          verificationToken: true,
          verificationTokenCreatedAt: true,
          emailConfirmation: true,
          accessToken: true
        }
      })
      return result
    } catch (error) {
      return undefined
    }
  }

  async update (params: UpdateGuardianRepository.Params): Promise<UpdateGuardianRepository.Result> {
    try {
      const { guardianId, ...updateData } = params
      const result = await db.guardian.update({
        where: { id: guardianId },
        data: updateData,
        omit: {
          password: true,
          verificationToken: true,
          verificationTokenCreatedAt: true,
          accessToken: true,
          email: true,
          emailConfirmation: true
        }
      })
      return result
    } catch (error) {
      return undefined
    }
  }
}
