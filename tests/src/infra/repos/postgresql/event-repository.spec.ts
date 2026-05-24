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

  describe('loadByDate Method', () => {
    it('Should return null if non existent date is provided', async () => {
      const sut = makeSut()
      const fakeDate = new Date('01-01-2001')
      const result = await sut.loadByDate({ guardianId: 'any_guardian_id', date: fakeDate })
      expect(result).toBe(null)
    })

    it('Should throw if load throws', async () => {
      const sut = makeSut()
      const fakeDate = new Date('01-01-2001')
      jest.spyOn(sut, 'loadByDate').mockRejectedValue(new Error())
      const promise = sut.loadByDate({ guardianId: 'any_guardian_id', date: fakeDate })
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
      const result = await sut.loadByDate({ guardianId: guardian.id, date: event.start })
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

  describe('loadAllByInterval Method', () => {
    it('Should return an empty array if no events are found', async () => {
      const sut = makeSut()
      const result = await sut.loadAllByInterval({
        guardianId: 'any_guardian_id',
        start: new Date('2000-01-01T00:00:00Z'),
        end: new Date('2000-01-02T00:00:00Z')
      })
      expect(result).toEqual([])
    })

    it('Should throw if loadAllByInterval throws', async () => {
      const sut = makeSut()
      jest.spyOn(sut, 'loadAllByInterval').mockRejectedValue(new Error())
      const promise = sut.loadAllByInterval({
        guardianId: 'any_guardian_id',
        start: new Date(),
        end: new Date()
      })
      await expect(promise).rejects.toThrow()
    })

    it('Should return events with scheduler, tag, and pets on success', async () => {
      const sut = makeSut()
      const guardian = await PrismaHelper.createGuardian()
      const pet = await PrismaHelper.createPet(guardian.id)
      const tag = await prisma.tag.create({
        data: { guardianId: guardian.id, name: 'any_name', color: 'any_color' }
      })
      const startAt = new Date('2025-06-25T10:00:00Z')
      const endAt = new Date('2025-06-25T11:00:00Z')
      const scheduler = await prisma.scheduler.create({
        data: {
          tagId: tag.id,
          guardianId: guardian.id,
          title: 'any_title',
          description: 'any_description',
          note: 'any_note',
          startAt,
          endAt,
          daysOfWeek: [],
          daysOfMonth: [],
          daily: false,
          pets: { connect: [{ id: pet.id }] }
        }
      })
      await prisma.event.create({
        data: { schedulerId: scheduler.id, start: startAt, end: endAt }
      })
      const result = await sut.loadAllByInterval({
        guardianId: guardian.id,
        start: new Date('2025-06-25T00:00:00Z'),
        end: new Date('2025-06-25T23:59:59Z')
      })
      expect(result[0]).toEqual(expect.objectContaining({
        id: expect.any(String),
        schedulerId: scheduler.id,
        start: startAt,
        end: endAt,
        scheduler: expect.objectContaining({
          title: 'any_title',
          description: 'any_description',
          note: 'any_note',
          tag: expect.objectContaining({ name: 'any_name', color: 'any_color' }),
          pets: expect.arrayContaining([expect.objectContaining({ id: pet.id })])
        })
      }))
    })

    it('Should return all events in same day', async () => {
      const sut = makeSut()
      const guardian = await PrismaHelper.createGuardian()
      const pet = await PrismaHelper.createPet(guardian.id)
      const tag = await prisma.tag.create({
        data: { guardianId: guardian.id, name: 'day_event_tag', color: 'blue' }
      })

      const date = new Date('2025-07-01T10:00:00Z')

      const scheduler = await prisma.scheduler.create({
        data: {
          tagId: tag.id,
          guardianId: guardian.id,
          title: 'event_day',
          description: 'single day event',
          note: '',
          startAt: date,
          endAt: date,
          daysOfWeek: [],
          daysOfMonth: [],
          daily: false,
          pets: { connect: [{ id: pet.id }] }
        }
      })

      await prisma.event.create({
        data: {
          schedulerId: scheduler.id,
          start: date,
          end: date
        }
      })

      const result = await sut.loadAllByInterval({
        guardianId: guardian.id,
        start: new Date('2025-07-01T00:00:00Z'),
        end: new Date('2025-07-01T23:59:59Z')
      })

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(expect.objectContaining({
        start: date,
        end: date
      }))
    })

    it('Should return all events from the same week', async () => {
      const sut = makeSut()
      const guardian = await PrismaHelper.createGuardian()
      const pet = await PrismaHelper.createPet(guardian.id)
      const tag = await prisma.tag.create({
        data: { guardianId: guardian.id, name: 'week_tag', color: 'green' }
      })

      const scheduler = await prisma.scheduler.create({
        data: {
          tagId: tag.id,
          guardianId: guardian.id,
          title: 'week_events',
          description: '',
          note: '',
          startAt: new Date('2025-07-02T10:00:00Z'),
          endAt: new Date('2025-07-05T10:00:00Z'),
          daysOfWeek: [],
          daysOfMonth: [],
          daily: false,
          pets: { connect: [{ id: pet.id }] }
        }
      })

      await prisma.event.createMany({
        data: [
          {
            schedulerId: scheduler.id,
            start: new Date('2025-07-02T10:00:00Z'),
            end: new Date('2025-07-02T11:00:00Z')
          },
          {
            schedulerId: scheduler.id,
            start: new Date('2025-07-05T14:00:00Z'),
            end: new Date('2025-07-05T15:00:00Z')
          }
        ]
      })

      const result = await sut.loadAllByInterval({
        guardianId: guardian.id,
        start: new Date('2025-06-30T00:00:00Z'),
        end: new Date('2025-07-06T23:59:59Z')
      })

      expect(result.length).toBeGreaterThanOrEqual(2)
      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({ start: new Date('2025-07-02T10:00:00Z') }),
        expect.objectContaining({ start: new Date('2025-07-05T14:00:00Z') })
      ]))
    })

    it('Should apply pagination with limit and offset', async () => {
      const sut = makeSut()
      const guardian = await PrismaHelper.createGuardian()
      const pet = await PrismaHelper.createPet(guardian.id)
      const tag = await prisma.tag.create({
        data: { guardianId: guardian.id, name: 'pagination_tag', color: 'yellow' }
      })

      const scheduler = await prisma.scheduler.create({
        data: {
          tagId: tag.id,
          guardianId: guardian.id,
          title: 'paginated_event',
          description: '',
          note: '',
          startAt: new Date('2025-08-01T10:00:00Z'),
          endAt: new Date('2025-08-01T12:00:00Z'),
          daysOfWeek: [],
          daysOfMonth: [],
          daily: false,
          pets: { connect: [{ id: pet.id }] }
        }
      })

      await prisma.event.createMany({
        data: [
          { schedulerId: scheduler.id, start: new Date('2025-08-01T10:00:00Z'), end: new Date('2025-08-01T11:00:00Z') },
          { schedulerId: scheduler.id, start: new Date('2025-08-01T11:00:00Z'), end: new Date('2025-08-01T12:00:00Z') },
          { schedulerId: scheduler.id, start: new Date('2025-08-01T12:00:00Z'), end: new Date('2025-08-01T13:00:00Z') }
        ]
      })

      const result = await sut.loadAllByInterval({
        guardianId: guardian.id,
        start: new Date('2025-08-01T00:00:00Z'),
        end: new Date('2025-08-01T23:59:59Z'),
        limit: 2,
        page: 1
      })

      expect(result).toHaveLength(2)
      expect(result[0].start).toEqual(new Date('2025-08-01T10:00:00Z'))
      expect(result[1].start).toEqual(new Date('2025-08-01T11:00:00Z'))
    })
  })

  describe('loadByPetAndTagId', () => {
    it('Should return an empty array when no events exist', async () => {
      const sut = makeSut()

      const guardian = await PrismaHelper.createGuardian()
      const pet = await PrismaHelper.createPet(guardian.id)
      const tag = await PrismaHelper.createTag(guardian.id)

      const result = await sut.loadByPetIdAndTagId({ guardianId: 'any_guardian_id', petId: pet.id, tagId: tag.id })
      expect(result.events).toEqual([])
    })

    it('Should return pagination information', async () => {
      const sut = makeSut()
      const guardian = await PrismaHelper.createGuardian()
      const pet = await PrismaHelper.createPet(guardian.id)
      const tag = await PrismaHelper.createTag(guardian.id)

      const dateFuture1 = generateDate().start
      const dateFuture2 = generateDate().end

      const scheduler = await prisma.scheduler.create({
        data: {
          guardianId: guardian.id,
          tagId: tag.id,
          title: 'any_title',
          description: 'any_description',
          note: 'any_note',
          startAt: dateFuture1,
          endAt: dateFuture2,
          daysOfWeek: [],
          daysOfMonth: [],
          daily: false,
          pets: { connect: [{ id: pet.id }] }
        }
      })

      await prisma.event.createMany({
        data: [
          { schedulerId: scheduler.id, start: dateFuture1, end: dateFuture1 },
          { schedulerId: scheduler.id, start: dateFuture2, end: dateFuture2 }
        ]
      })

      const result = await sut.loadByPetIdAndTagId({ guardianId: guardian.id, petId: pet.id, tagId: tag.id, limit: 1, page: 1 })

      expect(result.page).toBe(1)
      expect(result.limit).toBe(1)
      expect(result.totalPages).toBe(2)
    })

    it('Should return next events by petId and tagId on success', async () => {
      const sut = makeSut()
      const guardian = await PrismaHelper.createGuardian()
      const pet = await PrismaHelper.createPet(guardian.id)
      const tag = await PrismaHelper.createTag(guardian.id)

      const dateFuture1 = generateDate().start
      const dateFuture2 = generateDate().end
      const datePast = new Date('2024-01-01T10:00:00Z')

      const scheduler = await prisma.scheduler.create({
        data: {
          guardianId: guardian.id,
          tagId: tag.id,
          title: 'any_title',
          description: 'any_description',
          note: 'any_note',
          startAt: dateFuture1,
          endAt: dateFuture2,
          daysOfWeek: [],
          daysOfMonth: [],
          daily: false,
          pets: { connect: [{ id: pet.id }] }
        }
      })

      await prisma.event.createMany({
        data: [
          { schedulerId: scheduler.id, start: dateFuture2, end: dateFuture2 },
          { schedulerId: scheduler.id, start: dateFuture2, end: dateFuture2 },
          { schedulerId: scheduler.id, start: datePast, end: datePast }
        ]
      })

      const result = await sut.loadByPetIdAndTagId({ guardianId: guardian.id, petId: pet.id, tagId: tag.id, limit: 3, page: 1 })

      expect(result.events).toHaveLength(2)
    })

    it('Should throw if loadBypetIdAndTagId throws', async () => {
      const sut = makeSut()
      jest.spyOn(sut, 'loadByPetIdAndTagId').mockRejectedValue(new Error())
      const promise = sut.loadByPetIdAndTagId({ guardianId: 'any_guardian_id', petId: 'any_id', tagId: 'any_id', limit: 1, page: 1 })
      await expect(promise).rejects.toThrow()
    })
  })

  describe('loadNextByPetId()', () => {
    it('Should return empty array when no next events exist', async () => {
      const sut = makeSut()

      const guardian = await PrismaHelper.createGuardian()
      const pet = await PrismaHelper.createPet(guardian.id)

      const result = await sut.loadNextByPetId({ guardianId: guardian.id, petId: pet.id })
      expect(result.nextEvents).toEqual([])
    })

    it('Should return future events sorted ASC', async () => {
      const sut = makeSut()
      const guardian = await PrismaHelper.createGuardian()
      const pet = await PrismaHelper.createPet(guardian.id)
      const tag = await prisma.tag.create({
        data: { guardianId: guardian.id, name: 'future_tag', color: 'red' }
      })

      const future1 = new Date('2030-01-01T10:00:00Z')
      const future2 = new Date('2030-01-01T12:00:00Z')

      const scheduler = await prisma.scheduler.create({
        data: {
          guardianId: guardian.id,
          tagId: tag.id,
          title: 'future_events',
          description: '',
          note: '',
          startAt: future1,
          endAt: future2,
          daysOfWeek: [],
          daysOfMonth: [],
          daily: false,
          pets: { connect: [{ id: pet.id }] }
        }
      })

      await prisma.event.createMany({
        data: [
          { schedulerId: scheduler.id, start: future2, end: future2 },
          { schedulerId: scheduler.id, start: future1, end: future1 }
        ]
      })

      const result = await sut.loadNextByPetId({ guardianId: guardian.id, petId: pet.id })

      expect(result.nextEvents).toHaveLength(2)
      expect(result.nextEvents[0].start).toEqual(future1)
      expect(result.nextEvents[1].start).toEqual(future2)
    })
  })

  describe('loadPreviousByPetId()', () => {
    it('Should return empty history when no future events exist', async () => {
      const sut = makeSut()

      const guardian = await PrismaHelper.createGuardian()
      const pet = await PrismaHelper.createPet(guardian.id)

      const result = await sut.loadPreviousByPetId({ guardianId: guardian.id, petId: pet.id })
      expect(result.history).toEqual([])
    })

    it('Should return past events sorted DESC', async () => {
      const sut = makeSut()
      const guardian = await PrismaHelper.createGuardian()
      const pet = await PrismaHelper.createPet(guardian.id)
      const tag = await prisma.tag.create({
        data: { guardianId: guardian.id, name: 'next', color: 'blue' }
      })

      const past1 = new Date('2020-01-01T10:00:00Z')
      const past2 = new Date('2020-01-01T12:00:00Z')

      const scheduler = await prisma.scheduler.create({
        data: {
          guardianId: guardian.id,
          tagId: tag.id,
          title: 'future',
          description: '',
          note: '',
          startAt: past1,
          endAt: past2,
          daysOfWeek: [],
          daysOfMonth: [],
          daily: false,
          pets: { connect: [{ id: pet.id }] }
        }
      })

      await prisma.event.createMany({
        data: [
          { schedulerId: scheduler.id, start: past1, end: past1 },
          { schedulerId: scheduler.id, start: past2, end: past2 }
        ]
      })

      const result = await sut.loadPreviousByPetId({ guardianId: guardian.id, petId: pet.id })

      expect(result.history[0].start).toEqual(past2)
      expect(result.history[1].start).toEqual(past1)
    })
  })
})
