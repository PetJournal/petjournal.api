import { prisma as db } from './prisma'
import { type LoadSizeByNameRepository } from '@/data/protocols/db/size'

export class SizeRepository implements LoadSizeByNameRepository {
  async loadByName (name: LoadSizeByNameRepository.Params): Promise<LoadSizeByNameRepository.Result> {
    const size = await db.size.findFirst({ where: { name } })
    if (size) {
      return size
    }
  }
}
