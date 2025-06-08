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

  describe('toJSDate', () => {
    it('Should throw if toJSDate throws', () => {
      const sut = makeSut()
      const toJSDateMock = jest.fn(() => { throw new Error() })
      const fakeDateTime = { toJSDate: toJSDateMock }
      expect(() => sut.toJSDate(fakeDateTime)).toThrow()
      expect(toJSDateMock).toHaveBeenCalled()
    })

    it('Should return a Date JS format on success', () => {
      const sut = makeSut()
      const toJSDateMock = jest.fn(() => fakeDate.toString())
      const fakeDateTime = { toJSDate: toJSDateMock }
      const result = sut.toJSDate(fakeDateTime)
      expect(result).toEqual(fakeDate.toString())
    })
  })

  describe('setTime', () => {
    it('Should call setTime with correct values', () => {
      const sut = makeSut()
      const setMock = jest.fn().mockReturnValue({ toJSDate: jest.fn(() => 'mocked_date') })
      const fakeDateTime = { set: setMock }
      const params = {
        dateTime: fakeDateTime,
        time: {
          hour: 10,
          minute: 30,
          second: 15
        }
      }
      sut.setTime(params)
      expect(setMock).toHaveBeenCalledWith({
        hour: 10,
        minute: 30,
        second: 15
      })
    })

    it('Should throw if setTime throws', () => {
      const sut = makeSut()
      const setMock = jest.fn(() => { throw new Error() })
      const fakeDateTime = { set: setMock }
      const params = {
        dateTime: fakeDateTime,
        time: {
          hour: 10,
          minute: 30,
          second: 15
        }
      }
      expect(() => sut.setTime(params)).toThrow()
      expect(setMock).toHaveBeenCalled()
    })

    it('Should return a Date JS format with new time on success', () => {
      const sut = makeSut()
      const setMock = jest.fn().mockReturnValue({ toJSDate: jest.fn(() => 'mocked_date') })
      const fakeDateTime = { set: setMock }
      const params = {
        dateTime: fakeDateTime,
        time: {
          hour: 10,
          minute: 30,
          second: 15
        }
      }
      const result = sut.setTime(params)
      expect(result).toBe('mocked_date')
    })
  })

  describe('AddDay', () => {
    it('Should throw if addDay throws', () => {
      const sut = makeSut()
      const plusMock = jest.fn(() => { throw new Error() })
      const fakeDateTime = { addDay: plusMock }
      expect(() => sut.addDay(fakeDateTime)).toThrow()
    })

    it('Should add a day in dateTime on success', () => {
      const sut = makeSut()
      const plusMock = jest.fn(() => 'mocked_date')
      const fakeDateTime = { plus: plusMock }
      const result = sut.addDay(fakeDateTime)
      expect(plusMock).toHaveBeenCalledWith({ days: 1 })
      expect(result).toBe('mocked_date')
    })
  })
})
