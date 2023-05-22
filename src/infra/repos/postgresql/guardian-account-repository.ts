
import { prisma as db } from './prisma'
import {
  type LoadGuardianByEmailRepository,
  type AddGuardianRepository,
  type UpdateAccessTokenRepository,
  type LoadGuardianByIdRepository
} from '@/data/protocols'

export class GuardianAccountRepository implements AddGuardianRepository, LoadGuardianByEmailRepository, LoadGuardianByIdRepository, UpdateAccessTokenRepository {
  async add (guardianData: AddGuardianRepository.Params): Promise<AddGuardianRepository.Result> {
    const guardianHasEmailRegistered = await db.guardian.findUnique({
      where: { email: guardianData.email }
    })

    const guardianHasPhoneRegistered = await db.guardian.findUnique({
      where: { phone: guardianData.phone }
    })

    if (guardianHasEmailRegistered ?? guardianHasPhoneRegistered) {
      return undefined
    }
    return await db.guardian.create({
      data: guardianData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true
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

  async updateAccessToken (authentication: UpdateAccessTokenRepository.Params): Promise<UpdateAccessTokenRepository.Result> {
    const { id, token } = authentication
    const result = await db.guardian.update({ where: { id }, data: { accessToken: token } })
    return Boolean(result)
  }
}
