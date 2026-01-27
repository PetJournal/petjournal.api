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
    it('Should call pino.info with correct value', () => {
      const { sut } = makeSut()
      const infoSpy = jest.spyOn(pinoInstanceMock, 'info')

      const message = 'Test info message'

      sut.info(message)

      expect(infoSpy).toHaveBeenCalledWith(undefined, message)
    })
  })
})
