import { type AddGuardianRepository } from '@/data/protocols'
import { prisma as db } from './prisma'

export class GuardianAccountRepository implements AddGuardianRepository {
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
}
