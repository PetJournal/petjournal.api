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
    await PrismaHelper.clearPet()
    await PrismaHelper.clearScheduler()
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
      const pet = await PrismaHelper.createPet()
      const tag = await prisma.tag.create({
        data: {
          guardianId: pet.guardian.id,
          name: 'any_name',
          color: 'any_color'
        }
      })
      const data = {
        tagId: tag.id,
        guardianId: pet.guardian.id,
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
})
