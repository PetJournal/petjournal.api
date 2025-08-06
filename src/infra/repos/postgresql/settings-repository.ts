import { prisma as db } from './prisma'
import { type LoadSettingsRepository } from '@/data/protocols'

export class SettingsRepository implements LoadSettingsRepository {
  async loadAll (guardianId: LoadSettingsRepository.Param): Promise<LoadSettingsRepository.Result> {
    const settings = await db.settings.findMany({
      where: {
        guardianId
      }
    })
    return settings
  }
}
