import { PinoAdapter } from '@/infra/log/pino-adapter'
import type pino from 'pino'

let pinoInstanceMock: pino.Logger

jest.mock('pino', () => jest.fn().mockImplementation(() => {
  pinoInstanceMock = {
    info: jest.fn(),
    error: jest.fn()
  } as unknown as pino.Logger
  return pinoInstanceMock
}))

interface SutTypes {
  sut: PinoAdapter
}

const makeSut = (): SutTypes => {
  const sut = new PinoAdapter('TestLogger')

  return {
    sut
  }
}

describe('PinoAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('info()', () => {
    const message = 'Test info message'
    const meta = { userId: 123, line: 45 }

    it('Should call pino.info with correct message', () => {
      const { sut } = makeSut()
      const infoSpy = jest.spyOn(pinoInstanceMock, 'info')

      sut.info(message)

      expect(infoSpy).toHaveBeenCalledWith(undefined, message)
    })

    it('Should call pino.info with correct message and meta', () => {
      const { sut } = makeSut()

      const infoSpy = jest.spyOn(pinoInstanceMock, 'info')

      sut.info(message, meta)

      expect(infoSpy).toHaveBeenCalledWith(meta, message)
    })

    it('Should throw if pino.info throws', () => {
      const { sut } = makeSut()

      jest.spyOn(pinoInstanceMock, 'info').mockImplementationOnce(() => {
        throw new Error()
      })

      expect(() => { sut.info(message, meta) }).toThrow()
    })
  })

  describe('error()', () => {
    const message = 'Test error message'

    it('Should call pino.error with correct message', () => {
      const { sut } = makeSut()

      const errorSpy = jest.spyOn(pinoInstanceMock, 'error')

      sut.error(message)

      expect(errorSpy).toHaveBeenCalledWith(undefined, message)
    })
  })
})
