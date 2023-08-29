import { prisma as db } from '@/infra/repos/postgresql/prisma'

import { type AddPetRepository } from '@/data/protocols'

export class PetRepository implements AddPetRepository {
  async add (params: AddPetRepository.Params): Promise<AddPetRepository.Result> {
    try {
      const pet = await db.pet.create({
        data: {
          guardianId: params.guardianId,
          specieId: params.specieId,
          specieAlias: params.specieAlias
        },
        select: {
          id: true,
          specieAlias: true,
          guardian: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          specie: true
        }
      })
      return pet
    } catch (error) {
      return undefined
    }
  }
}
