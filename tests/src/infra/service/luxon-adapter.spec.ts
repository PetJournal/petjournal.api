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
  const fakeDate = new Date()
  describe('Generate', () => {
    it('Should call generate with correct values', () => {
      const sut = makeSut()
      const luxonSpy = jest.spyOn(DateTime, 'fromISO').mockReturnValue({ toISO: () => 'mocked_date' } as any)
      sut.generate(fakeDate)
      expect(luxonSpy).toHaveBeenCalledWith(fakeDate.toString(), { zone: 'utc' })
    })

    it('Should throw if generate throws', () => {
      const sut = makeSut()
      jest.spyOn(DateTime, 'fromISO').mockImplementationOnce(() => { throw new Error() })
      expect(() => { sut.generate(fakeDate) }).toThrow()
    })

    it('Should return a DateTime ISO format utc zone on success', () => {
      const sut = makeSut()
      jest.spyOn(DateTime, 'fromISO').mockReturnValue({ toISO: () => 'valid_date' } as any)
      const result = sut.generate(fakeDate)
      expect(result).toEqual(DateTime.fromISO(fakeDate.toString(), { zone: 'utc' }))
    })
  })
})
