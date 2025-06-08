import { LuxonAdapter } from '@/infra/service'
import { DateTime } from 'luxon'

jest.mock('luxon', () => {
  return {
    DateTime: {
      fromISO: jest.fn()
    }
  }
})

const makeSut = (): LuxonAdapter => {
  return new LuxonAdapter()
}

describe('Luxon Adapter', () => {
  describe('Generate', () => {
    it('Should call generate with correct values', () => {
      const sut = makeSut()
      const fakeDate = new Date()
      const luxonSpy = jest.spyOn(DateTime, 'fromISO').mockReturnValue({ toISO: () => 'mocked_date' } as any)
      sut.generate(fakeDate)
      expect(luxonSpy).toHaveBeenCalledWith(fakeDate.toString(), { zone: 'utc' })
    })
  })
})
