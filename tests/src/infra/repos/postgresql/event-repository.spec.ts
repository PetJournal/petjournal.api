import { type AddEventRepository } from '@/data/protocols'
import { EventRepository } from '@/infra/repos/postgresql'
import { prisma, PrismaHelper } from '@/tests/helpers/prisma-helper'

const makeSut = (): EventRepository => {
  return new EventRepository()
}

const generateDate = (): any => {
  const start = new Date()
  const end = new Date()
  end.setDate(end.getDate() + 1)
  return {
    start,
    end
  }
}

describe('Event Repository', () => {
  beforeAll(async () => { await PrismaHelper.connect() })

  beforeEach(async () => {
    await PrismaHelper.clearEvent()
    await PrismaHelper.clearScheduler()
    await PrismaHelper.clearTag()
    await PrismaHelper.clearPet()
    await PrismaHelper.clearSize()
    await PrismaHelper.clearBreed()
    await PrismaHelper.clearSpecie()
    await PrismaHelper.clearGuardian()
  })

  afterAll(async () => { await PrismaHelper.disconnect() })

  const params: AddEventRepository.Params = {
    schedulerId: 'any_scheduler_id',
    start: generateDate().start,
    end: generateDate().end
  }

  describe('Add Method', () => {
    it('Should return undefined if an error', async () => {
      const sut = makeSut()
      jest.spyOn(sut, 'add').mockRejectedValue(new Error())
      const promise = sut.add(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should return an event if a valid data is provided', async () => {
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
      const result = await sut.add({ schedulerId: scheduler.id, start: scheduler.startAt, end: scheduler.endAt })
      expect(result).toEqual({
        id: expect.any(String),
        schedulerId: expect.any(String),
        start: scheduler.startAt,
        end: scheduler.endAt
      })
    })
  })

  describe('loadByDateAndStart Method', () => {
    it('Should return null if non existent date is provided', async () => {
      const sut = makeSut()
      const fakeDate = new Date('01-01-2001')
      const result = await sut.loadByDateAndStart({ start: fakeDate })
      expect(result).toBe(null)
    })

    it('Should throw if load throws', async () => {
      const sut = makeSut()
      const fakeDate = new Date('01-01-2001')
      jest.spyOn(sut, 'loadByDateAndStart').mockRejectedValue(new Error())
      const promise = sut.loadByDateAndStart({ start: fakeDate })
      await expect(promise).rejects.toThrow()
    })

    it('Should return an event on success', async () => {
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
      const schedulerData = {
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
      const scheduler = await prisma.scheduler.create({ data: schedulerData })
      const event = await prisma.event.create({
        data: {
          schedulerId: scheduler.id,
          start: schedulerData.startAt,
          end: schedulerData.endAt
        }
      })
      const result = await sut.loadByDateAndStart({ start: event.start })
      expect(result).toEqual({
        id: expect.any(String),
        schedulerId: event.schedulerId,
        start: event.start,
        end: event.end
      })
    })
  })

  describe('AddMany Method', () => {
    it('Should throw if addMany throws', async () => {
      const sut = makeSut()
      jest.spyOn(sut, 'addMany').mockRejectedValue(new Error())
      const promise = sut.addMany([{
        schedulerId: 'any_scheduler_id',
        start: new Date(),
        end: new Date()
      }])
      await expect(promise).rejects.toThrow()
    })

    it('Should return false if invalid data is provided', async () => {
      const sut = makeSut()
      const result = await sut.addMany([{
        schedulerId: 'any_scheduler_id',
        start: new Date(),
        end: new Date()
      }])
      expect(result).toBe(false)
    })

    it('Should return true on success', async () => {
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
      const schedulerData = {
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
      const scheduler = await prisma.scheduler.create({ data: schedulerData })
      const result = await sut.addMany([{
        schedulerId: scheduler.id,
        start: scheduler.startAt,
        end: scheduler.endAt
      }])
      expect(result).toBe(true)
    })
  })
})
