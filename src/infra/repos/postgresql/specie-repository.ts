import { prisma as db } from '@/infra/repos/postgresql/prisma'

import { type LoadSpecieByNameRepository } from '@/data/protocols'

export class SpecieRepository implements LoadSpecieByNameRepository {
  async loadByName (name: LoadSpecieByNameRepository.Params): Promise<LoadSpecieByNameRepository.Result> {
    const specie = await db.specie.findUnique({ where: { name } })
    if (specie) {
      return specie
    }
  }
}
