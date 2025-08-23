import { LoadCurrentMonthTasksController } from '@/application/controllers'
import { success, serverError, type HttpResponse, type HttpRequest, badRequest } from '@/application/helpers'
import { type Validation } from '@/application/protocols'
import { type LoadCurrentMonthTasks } from '@/domain/use-cases'
import { makeFakeValidation } from '@/tests/utils'

const makeLoadCurrentMonthTasksUseCase = (): LoadCurrentMonthTasks => ({
  load: jest.fn().mockResolvedValue([
    { id: 'task1', schedulerId: 'sched_1', start: new Date(), end: new Date() },
    { id: 'task2', schedulerId: 'sched_2', start: new Date(), end: new Date() }
  ])
})

const makeFakeServerError = (): HttpResponse => {
  const error = new Error('internal_error')
  return serverError(error)
}

interface SutTypes {
  sut: LoadCurrentMonthTasksController
  loadCurrentMonthTasksStub: LoadCurrentMonthTasks
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const loadCurrentMonthTasksStub = makeLoadCurrentMonthTasksUseCase()
  const validationStub = makeFakeValidation()
  const sut = new LoadCurrentMonthTasksController({ loadCurrentMonthTasks: loadCurrentMonthTasksStub, validation: validationStub })
  return {
    sut,
    loadCurrentMonthTasksStub,
    validationStub
  }
}

describe('LoadCurrentMonthTasksController', () => {
  beforeAll(() => {
    const fixedDate = new Date('2025-06-18T15:00:00Z')
    jest.useFakeTimers().setSystemTime(fixedDate)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  const httpRequest: HttpRequest = {
    query: {
      tagId: 'anyTagId'
    }
  }

  describe('Validation', () => {
    it('Should call Validation with correct value', async () => {
      const { sut, validationStub } = makeSut()
      const validateSpy = jest.spyOn(validationStub, 'validate')

      await sut.handle(httpRequest)

      expect(validateSpy).toHaveBeenCalledWith(httpRequest.query)
    })

    it('Should return 400 (BadRequest) if Validation returns an error', async () => {
      const { sut, validationStub } = makeSut()
      jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new Error()))
    })
  })

  describe('LoadCurrentMonthTasks', () => {
    it('Should call LoadCurrentMonthTasks with current date at start of day UTC', async () => {
      const { sut, loadCurrentMonthTasksStub } = makeSut()
      const loadSpy = jest.spyOn(loadCurrentMonthTasksStub, 'load')

      const expectedStartOfDay = new Date('2025-06-18T00:00:00.000Z')

      await sut.handle(httpRequest)
      expect(loadSpy).toHaveBeenCalledWith(expect.objectContaining({
        date: expectedStartOfDay,
        tagId: httpRequest.query.tagId
      }))
    })

    it('Should return 500 if LoadCurrentMonthTasks throws', async () => {
      const { sut, loadCurrentMonthTasksStub } = makeSut()
      jest.spyOn(loadCurrentMonthTasksStub, 'load').mockRejectedValueOnce(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })

    it('Should return tasks on success', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(success({
        data: [
          { id: 'task1', schedulerId: 'sched_1', start: expect.any(Date), end: expect.any(Date) },
          { id: 'task2', schedulerId: 'sched_2', start: expect.any(Date), end: expect.any(Date) }
        ],
        pagination: {
          page: 1,
          limit: 10,
          count: 2
        }
      }))
    })

    it('Should call LoadCurrentMonthTasks with limit and offset from query', async () => {
      const { sut, loadCurrentMonthTasksStub } = makeSut()
      const loadSpy = jest.spyOn(loadCurrentMonthTasksStub, 'load')

      const httpRequest: HttpRequest = {
        query: { tagId: 'anyTagId', page: 2, limit: 5 }
      }

      await sut.handle(httpRequest)

      expect(loadSpy).toHaveBeenCalledWith(expect.objectContaining({
        tagId: 'anyTagId',
        limit: 5,
        offset: 5
      }))
    })

    it('Should return paginated response structure', async () => {
      const { sut } = makeSut()

      const httpRequest: HttpRequest = {
        query: { page: 1, limit: 2 }
      }

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(success({
        data: [
          { id: 'task1', schedulerId: 'sched_1', start: expect.any(Date), end: expect.any(Date) },
          { id: 'task2', schedulerId: 'sched_2', start: expect.any(Date), end: expect.any(Date) }
        ],
        pagination: {
          page: 1,
          limit: 2,
          count: 2
        }
      }))
    })
  })
})
