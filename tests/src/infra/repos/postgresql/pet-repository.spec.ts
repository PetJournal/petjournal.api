import { PetGender } from '@/domain/models/pet'
import { PetRepository } from '@/infra/repos/postgresql'
import { prisma as db } from '@/infra/repos/postgresql/prisma'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

const makeSut = (): PetRepository => {
  return new PetRepository()
}

describe('PetRepository', () => {
  beforeAll(async () => { await PrismaHelper.connect() })

  beforeEach(async () => {
    await PrismaHelper.clearPet()
    await PrismaHelper.clearSize()
    await PrismaHelper.clearBreed()
    await PrismaHelper.clearSpecie()
    await PrismaHelper.clearGuardian()
  })

  afterAll(async () => { await PrismaHelper.disconnect() })

  describe('AddPet method', () => {
    it('Should not return a pet if invalid data is provided', async () => {
      const sut = makeSut()
      const data = {
        guardianId: 'invalid_guardian_id',
        specieId: 'invalid_specie_id',
        specieAlias: 'invalid_specie_alias',
        petName: 'invalid_pet_name',
        gender: 'invalid_gender' as PetGender,
        breedId: 'invalid_breed_id',
        breedAlias: 'invalid_breed_alias',
        sizeId: 'invalid_size_id',
        castrated: false,
        dateOfBirth: new Date(2000, 10, 23)
      }

      const specie = await sut.add(data)

      expect(specie).toBeUndefined()
    })

    it('Should return a pet if valid data is provided', async () => {
      const sut = makeSut()
      const guardian = await db.guardian.create({
        data: {
          firstName: 'any_first_name',
          lastName: 'any_last_name',
          email: 'any_email',
          password: 'any_password',
          phone: 'any_phone',
          verificationToken: 'any_token'
        }
      })
      const specie = await db.specie.create({
        data: {
          name: 'any_name'
        }
      })
      const breed = await db.breed.create({
        data: {
          name: 'any_name',
          specieId: specie.id
        }
      })
      const size = await db.size.create({
        data: {
          name: 'any_name',
          specieId: specie.id
        }
      })
      const data = {
        guardianId: guardian.id,
        specieId: specie.id,
        specieAlias: 'any_specie_alias',
        petName: 'any_pet_name',
        gender: PetGender.MALE,
        breedId: breed.id,
        breedAlias: 'any_breed_alias',
        sizeId: size.id,
        castrated: false,
        dateOfBirth: new Date(2000, 10, 23)
      }

      const pet = await sut.add(data)

      expect(pet).toEqual({
        id: expect.any(String),
        guardian: {
          id: guardian.id,
          firstName: guardian.firstName,
          lastName: guardian.lastName,
          email: guardian.email,
          phone: guardian.phone,
          emailConfirmation: false
        },
        petName: data.petName,
        gender: data.gender,
        specieAlias: data.specieAlias,
        breedAlias: data.breedAlias,
        castrated: false,
        dateOfBirth: new Date(2000, 10, 23),
        specie,
        breed,
        size,
        image: ''
      })
    })
  })

  describe('UpdatePet method', () => {
    it('Should not return a pet if invalid data is provided', async () => {
      const sut = makeSut()
      const data = {
        guardianId: 'invalid_guardian_id',
        specieId: 'invalid_specie_id',
        specieAlias: 'invalid_specie_alias',
        petName: 'invalid_pet_name',
        gender: 'invalid_gender' as PetGender,
        breedId: 'invalid_breed_id',
        breedAlias: 'invalid_breed_alias',
        sizeId: 'invalid_size_id',
        castrated: false,
        dateOfBirth: new Date(2000, 10, 23)
      }

      const pet = await sut.add(data)

      expect(pet).toBeUndefined()
    })

    it('Should return a pet if valid data is provided', async () => {
      const sut = makeSut()
      const guardian = await db.guardian.create({
        data: {
          firstName: 'any_first_name',
          lastName: 'any_last_name',
          email: 'any_email',
          password: 'any_password',
          phone: 'any_phone',
          verificationToken: 'any_token'
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          emailConfirmation: true
        }
      })
      const specieFK = await db.specie.create({
        data: {
          name: 'any_name'
        }
      })
      const breed = await db.breed.create({
        data: {
          name: 'any_name',
          specieId: specieFK.id
        }
      })
      const size = await db.size.create({
        data: {
          name: 'any_name',
          specieId: specieFK.id
        }
      })

      const data = {
        guardianId: guardian.id,
        specieId: specieFK.id,
        specieAlias: 'any_specie_alias',
        petName: 'any_pet_name',
        gender: PetGender.MALE,
        breedId: breed.id,
        breedAlias: 'any_breed_alias',
        sizeId: size.id,
        castrated: false,
        dateOfBirth: new Date(2000, 10, 23),
        image: 'any_image'
      }

      const { id: petId, ...pet } = await db.pet.create({ data })

      const newData = {
        gender: PetGender.FEMALE,
        castrated: true
      }

      const updatedPet = await sut.update({
        guardianId: pet.guardianId,
        petId,
        ...newData
      })

      expect(updatedPet).toEqual({
        id: petId,
        breed,
        breedAlias: 'any_breed_alias',
        castrated: true,
        dateOfBirth: new Date(2000, 10, 23),
        gender: 'F',
        petName: 'any_pet_name',
        specie: {
          id: expect.any(String),
          name: 'any_name'
        },
        size,
        guardian,
        specieAlias: 'any_specie_alias',
        image: 'any_image'
      })
    })
  })

  describe('LoadPets method', () => {
    it('Should return a list of pets', async () => {
      const sut = makeSut()
      const guardian = await db.guardian.create({
        data: {
          firstName: 'any_first_name',
          lastName: 'any_last_name',
          email: 'any_email',
          password: 'any_password',
          phone: 'any_phone',
          verificationToken: 'any_token'
        }
      })
      const specie = await db.specie.create({
        data: {
          name: 'any_name'
        }
      })
      const breed = await db.breed.create({
        data: {
          name: 'any_name',
          specieId: specie.id
        }
      })
      const size = await db.size.create({
        data: {
          name: 'any_name',
          specieId: specie.id
        }
      })
      const data = {
        guardianId: guardian.id,
        specieId: specie.id,
        specieAlias: 'any_specie_alias',
        petName: 'any_pet_name',
        gender: PetGender.MALE,
        breedId: breed.id,
        breedAlias: 'any_breed_alias',
        sizeId: size.id,
        castrated: false,
        dateOfBirth: new Date(2000, 10, 23)
      }

      await sut.add(data)
      const result = await sut.loadByGuardianId(data.guardianId)

      expect(result).toEqual([{
        id: expect.any(String),
        breed: {
          id: breed.id,
          name: 'any_name'
        },
        breedAlias: 'any_breed_alias',
        castrated: false,
        gender: 'M',
        guardianId: expect.any(String),
        petName: 'any_pet_name',
        size: {
          id: size.id,
          name: 'any_name'
        },
        specieAlias: 'any_specie_alias',
        specie,
        dateOfBirth: new Date(2000, 10, 23)
      }])
    })

    it('Should LoadPets method return an empty array if there are no pets registered', async () => {
      const sut = makeSut()
      const guardian = await db.guardian.create({
        data: {
          firstName: 'any_first_name',
          lastName: 'any_last_name',
          email: 'any_email',
          password: 'any_password',
          phone: 'any_phone',
          verificationToken: 'any_token'
        }
      })

      const result = await sut.loadByGuardianId(guardian.id)

      expect(result).toEqual([])
    })
  })
})
