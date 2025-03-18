import { prisma as db } from '@/infra/repos/postgresql/prisma'
import { type LoadPetByGuardianIdRepository, type AddPetRepository, type UpdatePetRepository, type LoadPetByIdRepository, type DeletePetByIdRepository } from '@/data/protocols'

export class PetRepository implements
AddPetRepository,
LoadPetByGuardianIdRepository,
UpdatePetRepository,
LoadPetByIdRepository,
DeletePetByIdRepository {
  async add (params: AddPetRepository.Params): Promise<AddPetRepository.Result> {
    try {
      const pet = await db.pet.create({
        data: {
          guardianId: params.guardianId,
          specieId: params.specieId,
          specieAlias: params.specieAlias,
          petName: params.petName,
          gender: params.gender,
          breedId: params.breedId,
          breedAlias: params.breedAlias,
          sizeId: params.sizeId,
          castrated: params.castrated,
          dateOfBirth: params.dateOfBirth
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
              phone: true,
              emailConfirmation: true
            }
          },
          specie: true,
          petName: true,
          gender: true,
          breed: true,
          breedAlias: true,
          size: true,
          castrated: true,
          dateOfBirth: true,
          image: true
        }
      })
      return pet
    } catch (error) {
      return undefined
    }
  }

  async update (params: UpdatePetRepository.Params): Promise<UpdatePetRepository.Result> {
    const { petId, ...updateData } = params
    const pet = await db.pet.update({
      data: updateData,
      where: {
        id: petId
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
            phone: true,
            emailConfirmation: true
          }
        },
        specie: true,
        petName: true,
        gender: true,
        breed: true,
        breedAlias: true,
        size: true,
        castrated: true,
        dateOfBirth: true,
        image: true
      }
    })
    return pet
  }

  async loadByGuardianId (guardianId: LoadPetByGuardianIdRepository.Params): Promise<LoadPetByGuardianIdRepository.Result> {
    const pets = await db.pet.findMany({
      where: { guardianId },
      select: {
        id: true,
        guardianId: true,
        specie: {
          select: {
            id: true,
            name: true
          }
        },
        specieAlias: true,
        petName: true,
        gender: true,
        breedAlias: true,
        breed: {
          select: {
            id: true,
            name: true
          }
        },
        size: {
          select: {
            id: true,
            name: true
          }
        },
        castrated: true,
        dateOfBirth: true
      }
    })
    return pets
  }

  async loadById (petId: LoadPetByIdRepository.Params): Promise<LoadPetByIdRepository.Result> {
    const pet = await db.pet.findFirst({
      where: { id: petId },
      select: {
        id: true,
        guardianId: true,
        specie: {
          select: {
            id: true,
            name: true
          }
        },
        specieAlias: true,
        petName: true,
        gender: true,
        breedAlias: true,
        breed: {
          select: {
            id: true,
            name: true
          }
        },
        size: {
          select: {
            id: true,
            name: true
          }
        },
        castrated: true,
        dateOfBirth: true
      }
    })
    return pet
  }

  async deleteById (petId: DeletePetByIdRepository.Params): Promise<DeletePetByIdRepository.Result> {
    const pet = await db.pet.delete({
      where: { id: petId }
    })
    if (!pet) {
      return false
    }
    return true
  }
}
