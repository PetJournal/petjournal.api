import { type AddEventRepository } from '@/data/protocols'
import { EventRepository } from '@/infra/repos/postgresql'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

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
  })
})
