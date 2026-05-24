import { prisma as db } from './prisma'
import { type UpdateSettingsRepository, type LoadSettingsRepository } from '@/data/protocols'

export class SettingsRepository implements LoadSettingsRepository, UpdateSettingsRepository {
  async loadAll (guardianId: LoadSettingsRepository.Param): Promise<LoadSettingsRepository.Result> {
    const settings = await db.settings.findMany({
      where: { guardianId },
      select: {
        notificationEmail: true,
        notificationMobile: true
      }
    })
    return settings
  }

  async update (params: UpdateSettingsRepository.Params): Promise<UpdateSettingsRepository.Result> {
    const { guardianId, notificationEmail, notificationMobile } = params
    const settings = await db.settings.update({
      data: {
        notificationEmail,
        notificationMobile
      },
      where: {
        guardianId
      },
      select: {
        guardianId: true,
        notificationEmail: true,
        notificationMobile: true
      }
    })
    return settings
  }
}
