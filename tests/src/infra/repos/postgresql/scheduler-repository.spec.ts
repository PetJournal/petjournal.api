import { type AddSchedulerRepository } from '@/data/protocols'
import { SchedulerRepository } from '@/infra/repos/postgresql/scheduler-repository'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

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
  })
})
