import { type AddSchedulerRepository } from '@/data/protocols'
import { SchedulerRepository } from '@/infra/repos/postgresql/scheduler-repository'
import { prisma, PrismaHelper } from '@/tests/helpers/prisma-helper'

const makeSut = (): SchedulerRepository => {
  return new SchedulerRepository()
}

describe('Scheduler Repository', () => {
  beforeAll(async () => { await PrismaHelper.connect() })

  beforeEach(async () => {
    await PrismaHelper.clearScheduler()
    await PrismaHelper.clearTag()
    await PrismaHelper.clearPet()
    await PrismaHelper.clearSize()
    await PrismaHelper.clearBreed()
    await PrismaHelper.clearSpecie()
    await PrismaHelper.clearGuardian()
  })

  afterAll(async () => { await PrismaHelper.disconnect() })
  describe('Add Method', () => {
    const params: AddSchedulerRepository.Params = {
      tagId: 'any_tag_id',
      guardianId: 'any_guardian_id',
      title: 'any_title',
      description: 'any_description',
      note: 'any_note',
      startAt: new Date('2024-04-04T15:00:00Z'),
      endAt: new Date('2025-04-04T17:00:00Z'),
      daysOfWeek: [],
      daysOfMonth: [],
      daily: false,
      pets: ['any_pet_id']
    }
    it('Should throw if add throws', async () => {
      const sut = makeSut()
      jest.spyOn(sut, 'add').mockRejectedValue(new Error())
      const promise = sut.add(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should return undefined if an error', async () => {
      const sut = makeSut()
      jest.spyOn(sut, 'add').mockResolvedValueOnce(undefined)
      const result = await sut.add({ ...params, tagId: 'invalid_tagId' })
      expect(result).toBe(undefined)
    })

    it('Should return a scheduler on success', async () => {
      const sut = makeSut()
      const guardian = await PrismaHelper.createGuardian()
      const pet = await PrismaHelper.createPet(guardian.id)
      const tag = await prisma.tag.create({
        data: {
          guardianId: guardian.id,
          name: 'any_name',
          color: 'any_color'
        }
      })
      const addParams = {
        ...params,
        tagId: tag.id,
        guardianId: guardian.id,
        pets: [pet.id]
      }
      const result = await sut.add(addParams)
      expect(result).toEqual({
        id: expect.any(String),
        tagId: expect.any(String),
        guardianId: expect.any(String),
        title: 'any_title',
        description: 'any_description',
        note: 'any_note',
        startAt: new Date('2024-04-04T15:00:00Z'),
        endAt: new Date('2025-04-04T17:00:00Z'),
        daysOfWeek: [],
        daysOfMonth: [],
        daily: false,
        pets: [{
          id: expect.any(String),
          specieAlias: 'any_specie_alias',
          guardianId: expect.any(String),
          specieId: expect.any(String),
          petName: 'any_pet_name',
          gender: 'M',
          breedAlias: 'any_breed_alias',
          breedId: expect.any(String),
          sizeId: expect.any(String),
          castrated: false,
          dateOfBirth: new Date('2000-11-23T02:00:00.000Z'),
          image: ''
        }]
      })
    })
  })

  describe('Delete Method', () => {
    it('Should return false if delete fails', async () => {
      const sut = makeSut()
      jest.spyOn(sut, 'delete').mockResolvedValueOnce(false)
      const result = await sut.delete('any_scheduler_id')
      expect(result).toBe(false)
    })

    it('Should throw if delete throws', async () => {
      const sut = makeSut()
      jest.spyOn(sut, 'delete').mockRejectedValue(new Error())
      const promise = sut.delete('any_scheduler_id')
      await expect(promise).rejects.toThrow()
    })

    it('Should return true on delete success', async () => {
      const sut = makeSut()
      const guardian = await PrismaHelper.createGuardian()
      const pet = await PrismaHelper.createPet(guardian.id)
      const tag = await prisma.tag.create({
        data: {
          guardianId: guardian.id,
          name: 'any_name',
          color: 'any_color'
        }
      })
      const data = {
        tagId: tag.id,
        guardianId: guardian.id,
        title: 'any_title',
        description: 'any_description',
        note: 'any_note',
        startAt: new Date('2024-04-04T15:00:00Z'),
        endAt: new Date('2025-04-04T17:00:00Z'),
        daysOfWeek: [],
        daysOfMonth: [],
        daily: false,
        pets: { connect: [{ id: pet.id }] }
      }
      const scheduler = await prisma.scheduler.create({ data })
      const result = await sut.delete(scheduler.id)
      expect(result).toBe(true)
    })
  })
})
